import React, { useState, useRef, useCallback, useEffect } from 'react';
import { calculateImageBrightness } from '../utils/analysis';
import { AppButton } from './AppButton';
import { usePesticideStore, PREDEFINED_PESTICIDES } from '../state/pesticideStore';

interface CaptureScreenProps {
  onAnalysisComplete: (brightness: number, imageSrc: string, pesticide: string) => void;
}

const ROI_CONFIG = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 }; // Center 50% of the image

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onAnalysisComplete }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { selectedPesticide, setSelectedPesticide } = usePesticideStore();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageRef.current || !imageSrc) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const brightness = await calculateImageBrightness(imageRef.current, ROI_CONFIG);
      onAnalysisComplete(brightness, imageSrc, selectedPesticide);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try a different one.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageSrc, onAnalysisComplete, selectedPesticide]);
  
  const handleClearImage = () => {
    setImageSrc(null);
    setError(null);
  };

  // --- Camera Logic ---
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
  }, []);

  const handleOpenCamera = () => {
    setError(null);
    setIsCameraOpen(true);
  };

  const handleCloseCamera = useCallback(() => {
    stopCamera();
    setIsCameraOpen(false);
  }, [stopCamera]);

  const handleCapturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not process image.');
      handleCloseCamera();
      return;
    }
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImageSrc(dataUrl);
    handleCloseCamera();
  }, [handleCloseCamera]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Error accessing camera: ", err);
        let message = 'Could not access camera.';
        if (err instanceof Error && err.name === 'NotAllowedError') {
          message = 'Camera permission was denied. Please allow camera access in your browser settings.';
        }
        setError(message);
        setIsCameraOpen(false);
      }
    };

    if (isCameraOpen) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isCameraOpen, stopCamera]);


  return (
    <>
      <div className="p-4 md:p-6 max-w-2xl mx-auto flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold text-cyan-400">Analyze Sample</h2>
        <div className="w-full bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
          
          <div className="w-full max-w-md mb-4">
            <label htmlFor="pesticide-select" className="block text-sm font-medium text-gray-400 mb-1">
              Select Pesticide
            </label>
            <select
              id="pesticide-select"
              value={selectedPesticide}
              onChange={(e) => setSelectedPesticide(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={!!imageSrc}
            >
              {PREDEFINED_PESTICIDES.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full max-w-md aspect-square bg-gray-900 rounded-md overflow-hidden mb-4 flex items-center justify-center border-2 border-dashed border-gray-600">
            {imageSrc ? (
              <>
                <img ref={imageRef} src={imageSrc} alt="Sample" className="w-full h-full object-contain" />
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-cyan-400 border-dashed pointer-events-none">
                  <div className="absolute -top-2 -left-2 text-cyan-400 bg-gray-900 px-1 text-xs">ROI</div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="mt-2">Upload or capture an image</p>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex space-x-4">
            {imageSrc ? (
              <>
                <AppButton onClick={handleClearImage} variant="secondary">
                  Change Image
                </AppButton>
                <AppButton onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </AppButton>
              </>
            ) : (
              <>
                <AppButton onClick={() => fileInputRef.current?.click()} variant="secondary">
                  Upload Image
                </AppButton>
                <AppButton onClick={handleOpenCamera}>
                  Use Camera
                </AppButton>
              </>
            )}
          </div>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="camera-title">
          <h2 id="camera-title" className="sr-only">Camera View</h2>
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain"></video>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-400 border-dashed pointer-events-none"
               style={{ width: 'min(75vw, 75vh, 400px)', height: 'min(75vw, 75vh, 400px)' }}>
            <div className="absolute -top-2 -left-2 text-cyan-400 bg-gray-900 px-1 text-xs">ROI</div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 flex justify-center space-x-4">
            <AppButton onClick={handleCapturePhoto}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Take Photo
            </AppButton>
            <AppButton onClick={handleCloseCamera} variant="secondary">Cancel</AppButton>
          </div>
        </div>
      )}
    </>
  );
};
