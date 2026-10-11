import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface CivicImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const CivicImage: React.FC<CivicImageProps> = ({
  src,
  alt,
  className,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 ${className}`}>
        <ImageIcon className="w-8 h-8" />
        <span className="text-xs ml-2">Retry Image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      style={{ objectFit: 'cover' }}
    />
  );
};
