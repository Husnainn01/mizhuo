'use client';

import Breadcrumb from './Breadcrumb';

interface PageTemplateProps {
  title?: string;
  subtitle?: string;
  breadcrumbTitle?: string;
  customBreadcrumbs?: {
    label: string;
    href: string;
  }[];
  showBreadcrumb?: boolean;
  children: React.ReactNode;
  className?: string;
  breadcrumbClassName?: string;
}

const PageTemplate = ({
  title,
  subtitle,
  breadcrumbTitle,
  customBreadcrumbs,
  showBreadcrumb = true,
  children,
  className = '',
  breadcrumbClassName = ''
}: PageTemplateProps) => {
  return (
    <div className={`container mx-auto px-4 py-8 bg-white w-full ${className}`}>
      {showBreadcrumb && (
        <Breadcrumb 
          customItems={customBreadcrumbs}
          currentPageLabel={breadcrumbTitle || title}
          className={breadcrumbClassName}
        />
      )}
      
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h1 className="text-3xl font-bold mb-2 text-black">{title}</h1>}
          {subtitle && <p className="text-black/70">{subtitle}</p>}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default PageTemplate; 