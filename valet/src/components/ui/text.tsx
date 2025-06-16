import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ children, className, ...props }) => {
  return (
    <p className={cn('text-base', className)} {...props}>
      {children}
    </p>
  );
}; 