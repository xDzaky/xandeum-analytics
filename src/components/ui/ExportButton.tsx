import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonProps {
  onExport: () => void;
  label?: string;
  format: 'csv' | 'json';
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function ExportButton({
  onExport,
  label,
  format,
  variant = 'secondary',
  size = 'md',
  disabled = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = async () => {
    setIsExporting(true);
    try {
      await onExport();
      // Show success feedback
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const Icon = format === 'json' ? FileJson : FileSpreadsheet;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isExporting}
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isExporting ? 'scale-95' : 'hover:scale-105'}
      `}
      title={`Export as ${format.toUpperCase()}`}
    >
      {isExporting ? (
        <div className="animate-spin">
          <Download className="w-4 h-4" />
        </div>
      ) : (
        <Icon className="w-4 h-4" />
      )}
      <span>{label || `Export ${format.toUpperCase()}`}</span>
    </button>
  );
}
