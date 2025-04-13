
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface MovingBorderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const MovingBorderButton = ({ 
  children, 
  className = "", 
  variant = "default", 
  ...props 
}: MovingBorderButtonProps) => {
  return (
    <Button
      className={`relative moving-border-button ${className}`}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MovingBorderButton;
