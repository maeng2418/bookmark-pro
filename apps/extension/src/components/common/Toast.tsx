import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@bookmark-pro/ui";

export interface ToastProps {
  type: "success" | "error" | "warning";
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast = ({ type, message, duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      const animationTimer = setTimeout(onClose, 300); // Wait for animation to complete
      
      // Return cleanup for both timers
      return () => clearTimeout(animationTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
    }
  };

  return (
    <div
      className={`
        w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}
    >
      <div className={`p-3 rounded-lg border shadow-lg ${getBgColor()}`}>
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-relaxed break-words ${getTextColor()}`}>
              {message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className={`w-6 h-6 flex-shrink-0 ${getTextColor()} hover:bg-white/20`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toast;