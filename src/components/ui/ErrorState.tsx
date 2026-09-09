import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  fullScreen = false,
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white z-50"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="max-w-md mx-auto text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#001c3b] text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  message: string;
  icon?: React.ReactNode;
}> = ({ title, message, icon }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="max-w-md mx-auto text-center px-4">
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
