import React, { useState, useCallback } from 'react';
import { calculateMultipleBrightness, PESTICIDE_ROIS } from '../../utils/analysis';
import { AppButton } from '../shared';
import { CameraCapture, ImageUpload, ImageDisplay } from './';

interface CaptureScreenProps {
  onAnalysisComplete: (results: { name: string, brightness: number }[], imageSrc: string) => void;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onAnalysisComplete }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleImageSelect = (src: string) => {
    setImageSrc(src);
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageSrc) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      // Create a temporary image element to analyze
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const brightnessResults = await calculateMultipleBrightness(img, PESTICIDE_ROIS);
      onAnalysisComplete(brightnessResults, imageSrc);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try a different one.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageSrc, onAnalysisComplete]);
  
  const handleClearImage = () => {
    setImageSrc(null);
    setError(null);
  };

  const handleOpenCamera = () => {
    setError(null);
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCameraError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <>
      <div className="p-4 md:p-6 max-w-2xl mx-auto flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold text-cyan-400">Analyze Sample Kit</h2>
        <div className="w-full bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
          
          <ImageDisplay imageSrc={imageSrc} />

          {imageSrc ? (
            <div className="flex space-x-4">
              <AppButton onClick={handleClearImage} variant="secondary">
                Change Image
              </AppButton>
              <AppButton onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </AppButton>
            </div>
          ) : (
            <ImageUpload onImageSelect={handleImageSelect} onOpenCamera={handleOpenCamera} />
          )}
          
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>
      </div>

      {isCameraOpen && (
        <CameraCapture 
          onCapture={handleImageSelect}
          onClose={handleCloseCamera}
          onError={handleCameraError}
        />
      )}
    </>
  );
};