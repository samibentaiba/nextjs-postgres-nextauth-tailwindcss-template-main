import { Loader2Icon } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
  className?: string;
}

export function UILoading({
  size = 'md',
  text = 'Loading...',
  fullPage = false,
  className = ''
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullPage
    ? 'flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <Loader2Icon
        className={`${sizeClasses[size]} animate-spin text-primary`}
      />
      {text && (
        <p className="mt-4 text-center text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
