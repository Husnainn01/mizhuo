'use client';

import { useState, useEffect } from 'react';

interface AttributeFormProps {
  initialData?: {
    _id?: string;
    name: string;
    value: string;
    description?: string;
    type: string;
    isActive: boolean;
  };
  onSubmit: (data: any) => void;
  attributeType: string;
  isEditing?: boolean;
  isSubmitting: boolean;
}

export default function AttributeForm({
  initialData,
  onSubmit,
  attributeType,
  isEditing = false,
  isSubmitting
}: AttributeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    description: '',
    isActive: true,
    type: attributeType
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        value: initialData.value || '',
        description: initialData.description || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        type: attributeType
      });
    }
  }, [initialData, attributeType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error on field change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.value.trim()) {
      newErrors.value = 'Value is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Get attribute type display name
  const getAttributeTypeDisplayName = () => {
    switch (attributeType) {
      case 'transmission':
        return 'Transmission Type';
      case 'fuel':
        return 'Fuel Type';
      case 'body':
        return 'Body Type';
      case 'drive':
        return 'Drive Type';
      case 'feature':
        return 'Feature';
      default:
        return 'Attribute';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Display Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={`e.g. Automatic Transmission`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
          Value <span className="text-red-500">*</span>
          <span className="ml-1 text-xs text-gray-500">(used in code)</span>
        </label>
        <input
          type="text"
          id="value"
          name="value"
          value={formData.value}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.value ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={`e.g. automatic`}
          disabled={isSubmitting}
        />
        {errors.value && (
          <p className="mt-1 text-sm text-red-500">{errors.value}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Optional description for this ${getAttributeTypeDisplayName().toLowerCase()}`}
          disabled={isSubmitting}
        ></textarea>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange as any}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isSubmitting}
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Active (available for selection)
        </label>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`py-2 px-4 rounded-md ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium flex items-center`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            isEditing ? 'Update' : 'Add'
          )}
        </button>
      </div>
    </form>
  );
} 