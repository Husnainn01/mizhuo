'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageItem {
  id: string;
  url: string;
}

interface SortableImageGalleryProps {
  images: ImageItem[];
  onImagesReordered: (images: ImageItem[]) => void;
  onRemoveImage: (index: number) => void;
  mainImageIndex: number;
  onSetMainImage: (index: number) => void;
}

// Individual sortable image component
const SortableImage = ({ 
  image, 
  index, 
  isMain, 
  onSetMain, 
  onRemove 
}: { 
  image: ImageItem; 
  index: number; 
  isMain: boolean; 
  onSetMain: () => void; 
  onRemove: () => void;
}) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group border ${isMain ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'} rounded-lg overflow-hidden`}
    >
      <div 
        className="aspect-w-4 aspect-h-3 cursor-grab"
        {...attributes} 
        {...listeners}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={`Image ${index + 1}`}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-black/50 to-transparent">
        <button
          type="button"
          onClick={onSetMain}
          className={`p-1 rounded-full ${isMain ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          title={isMain ? "Main Image" : "Set as Main Image"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
          title="Remove Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {isMain && (
        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs py-1 text-center">
          Main Image
        </div>
      )}
    </div>
  );
};

const SortableImageGallery: React.FC<SortableImageGalleryProps> = ({
  images,
  onImagesReordered,
  onRemoveImage,
  mainImageIndex,
  onSetMainImage
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(item => item.id === active.id);
      const newIndex = images.findIndex(item => item.id === over.id);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      
      // If main image was moved, adjust the main image index
      let newMainIndex = mainImageIndex;
      if (mainImageIndex === oldIndex) {
        newMainIndex = newIndex;
      } else if (mainImageIndex >= newIndex && mainImageIndex < oldIndex) {
        newMainIndex++;
      } else if (mainImageIndex <= newIndex && mainImageIndex > oldIndex) {
        newMainIndex--;
      }
      
      onImagesReordered(newImages);
      onSetMainImage(newMainIndex);
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Images:</h3>
      <SortableContext 
        items={images.map(img => img.id)} 
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <SortableImage 
              key={image.id} 
              image={image} 
              index={index}
              isMain={index === mainImageIndex}
              onSetMain={() => onSetMainImage(index)}
              onRemove={() => onRemoveImage(index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableImageGallery; 