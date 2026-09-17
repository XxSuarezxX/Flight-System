import { useEffect } from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

function Notification({ message, onClose }: NotificationProps) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [message, onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 w-full max-w-sm bg-white border border-red-200 rounded-xl shadow-lg p-4">
      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="font-semibold text-red-600">
            Action could not be completed
          </p>

          <p className="text-sm text-slate-600 mt-1">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-xl leading-none"
        >
          ×
        </button>

      </div>
    </div>
  );
}

export default Notification;