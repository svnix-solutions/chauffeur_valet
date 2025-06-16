import React from 'react';
import { cn } from '@/lib/utils';

interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const View: React.FC<ViewProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  );
}; 