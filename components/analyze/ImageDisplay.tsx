import React, { forwardRef } from 'react';
import { PESTICIDE_ROIS } from '../../utils/analysis';

interface ImageDisplayProps {
  imageSrc: string | null;
  showROIs?: boolean;
}

export const ImageDisplay = forwardRef<HTMLImageElement, ImageDisplayProps>(
  ({ imageSrc, showROIs = true }, ref) => {
    return (
      <div className="relative w-full max-w-md aspect-square bg-gray-900 rounded-md overflow-hidden mb-4 flex items-center justify-center border-2 border-dashed border-gray-600">
        {imageSrc ? (
          <>
            <img ref={ref} src={imageSrc} alt="Sample" className="w-full h-full object-contain" />
            {showROIs && PESTICIDE_ROIS.map(({name, roi}) => (
                <div 
                    key={name}
                    className="absolute border-2 border-cyan-400 border-dashed pointer-events-none"
                    style={{ top: `${roi.y * 100}%`, left: `${roi.x * 100}%`, width: `${roi.width * 100}%`, height: `${roi.height * 100}%` }}
                >
                    <div className="absolute -top-5 left-0 text-cyan-400 bg-gray-900 bg-opacity-70 px-1 text-xs rounded">{name}</div>
                </div>
            ))}
          </>
        ) : (
          <div className="text-center text-gray-500 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="mt-2">Upload or capture an image of the kit</p>
          </div>
        )}
      </div>
    );
  }
); 