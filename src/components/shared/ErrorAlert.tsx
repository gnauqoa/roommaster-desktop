import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export const ErrorAlert = ({ message, onClose, className }: ErrorAlertProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-full p-1 hover:bg-destructive/20"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

