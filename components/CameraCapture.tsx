
import React, { useRef, useEffect, useState } from 'react';
import { Button } from './Button';

interface CameraCaptureProps {
  onCapture: (image: string, email?: string, phone?: string) => void;
  onCancel: () => void;
}

// Utility to compress images before sending to API
const compressImage = (base64Str: string, maxWidth = 1280, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio while resizing
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
          resolve(base64Str); // Fallback
      }
    };
    img.onerror = () => {
        resolve(base64Str); // Fallback
    }
  });
};

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    const startCamera = async () => {
      try {
        setError(null);
        setIsInitializing(true);
        
        if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API not supported");
        }

        // Attempt 1: HD User facing
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
              aspectRatio: { ideal: 0.75 } // Portrait preferred
            }
          });
        } catch (err) {
          // Attempt 2: Basic settings
          try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: true 
            });
          } catch (innerErr) {
             throw innerErr; // Throw the fallback error
          }
        }

        if (!mounted) {
            if (stream) {
                (stream as MediaStream).getTracks().forEach(track => track.stop());
            }
            return;
        }

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (mounted && videoRef.current) {
                videoRef.current.play()
                .then(() => setStreamActive(true))
                .catch(e => console.warn("Play error:", e));
            }
          };
        }
      } catch (err: any) {
        if (!mounted) return;
        
        let userMessage = "Could not access camera.";
        const errorName = err.name || '';
        const errorMessage = err.message || '';
        
        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
            userMessage = "Camera permission denied.";
        } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError' || errorMessage.includes('device not found')) {
            userMessage = "No camera found on this device.";
        } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
            userMessage = "Camera is in use by another app.";
        } else if (errorMessage === "Camera API not supported") {
            userMessage = "Camera not supported in this browser.";
        } else {
            console.error("Camera initialization failed:", err);
        }

        setError(userMessage);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current && streamActive) {
      setIsProcessing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        
        const rawData = canvas.toDataURL('image/jpeg', 0.9);
        
        // Compress before sending
        try {
            const compressed = await compressImage(rawData);
            onCapture(compressed, email, phone);
        } catch (e) {
            console.error("Compression failed, sending raw", e);
            onCapture(rawData, email, phone);
        } finally {
            setIsProcessing(false);
        }
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        try {
            const compressed = await compressImage(result);
            onCapture(compressed, email, phone);
        } catch (e) {
            onCapture(result, email, phone);
        } finally {
            setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (error) {
    return (
      <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8 text-center animate-fade-in shadow-xl mx-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-500 dark:text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error}</h3>
        <p className="text-gray-500 dark:text-zinc-400 mb-6 max-w-xs mx-auto text-sm">
            Don't worry, you can still analyze your looks by uploading a photo directly.
        </p>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
             <input 
                type="email" 
                placeholder="Email (Optional)" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
            />
            <input 
                type="tel" 
                placeholder="Phone Number (Optional)" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
            />
            
            <div className="h-2"></div>

             <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
            />
            <Button onClick={triggerFileUpload} variant="primary" disabled={isProcessing}>
                {isProcessing ? 'Optimizing...' : 'Upload Photo'}
            </Button>
            <Button onClick={onCancel} variant="outline" disabled={isProcessing}>
                Cancel
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md md:max-w-2xl mx-auto flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 dark:border-zinc-800 bg-black group transition-all duration-300">
      
      {/* Video Container - Maintain Aspect Ratio but cover container */}
      <div className="relative aspect-[3/4] md:aspect-video w-full overflow-hidden bg-zinc-900">
        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanning Overlay UI */}
        {streamActive && !isProcessing && (
            <>
                <div className="absolute inset-0 pointer-events-none z-10">
                    {/* Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-[scan_3s_ease-in-out_infinite] opacity-60"></div>
                    
                    {/* Tech Corners */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/30 rounded-tl-xl"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/30 rounded-tr-xl"></div>
                    <div className="absolute bottom-24 md:bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/30 rounded-bl-xl"></div>
                    <div className="absolute bottom-24 md:bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/30 rounded-br-xl"></div>

                    {/* Center Face Guide */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] md:w-64 md:h-80 border-2 border-white/20 rounded-[50%] shadow-[0_0_50px_rgba(0,0,0,0.5)_inset]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-amber-500/90 text-[10px] md:text-xs uppercase tracking-[0.2em] whitespace-nowrap font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-amber-500/20">
                            Subject Alignment
                        </div>
                        {/* Crosshair */}
                        <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 opacity-40">
                            <div className="absolute w-full h-px bg-white"></div>
                            <div className="absolute h-full w-px bg-white left-1/2 -translate-x-1/2"></div>
                        </div>
                    </div>
                </div>
                {/* Scan Animation Style */}
                <style>{`
                    @keyframes scan {
                        0% { top: 0%; opacity: 0; }
                        15% { opacity: 1; }
                        85% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                `}</style>
            </>
        )}
        
        {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white text-sm font-bold tracking-widest animate-pulse">OPTIMIZING SCAN...</p>
            </div>
        )}
        
        {(isInitializing || !streamActive) && !isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20">
                <div className="animate-spin w-10 h-10 border-2 border-white/20 border-t-amber-500 rounded-full mb-4"></div>
                <p className="text-zinc-500 text-sm font-medium animate-pulse">Initializing Optical Sensors...</p>
            </div>
        )}
      </div>

      {/* Control Area - Glassmorphism */}
      <div className="relative bg-zinc-900 border-t border-zinc-800 p-4 md:p-6 flex flex-col gap-4 z-20">
        
        {/* Input Fields */}
        <div className="flex flex-row gap-2 w-full max-w-lg mx-auto">
            <input 
                type="email" 
                placeholder="Email (Opt)" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-1/2 bg-zinc-800/50 border border-zinc-700 rounded-xl px-3 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:bg-zinc-800 transition-all text-xs md:text-sm text-center appearance-none"
                disabled={isProcessing}
            />
            <input 
                type="tel" 
                placeholder="Phone (Opt)" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-1/2 bg-zinc-800/50 border border-zinc-700 rounded-xl px-3 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:bg-zinc-800 transition-all text-xs md:text-sm text-center appearance-none"
                disabled={isProcessing}
            />
        </div>

        {/* Buttons Row */}
        <div className="flex justify-between items-center w-full px-2 mt-2">
            <button 
            onClick={onCancel}
            disabled={isProcessing}
            className="text-zinc-400 hover:text-white font-medium transition-colors px-4 py-2 rounded-full hover:bg-white/5 text-sm disabled:opacity-50"
            >
            Cancel
            </button>
            
            <button 
            onClick={handleCapture}
            disabled={!streamActive || isProcessing}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-zinc-700 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group shadow-lg shadow-black/50"
            >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] group-active:scale-90 transition-transform group-hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"></div>
            </button>

            <div className="relative">
                <button 
                    onClick={triggerFileUpload}
                    disabled={isProcessing}
                    className="text-zinc-400 hover:text-white font-medium transition-colors flex flex-col items-center gap-1 group p-2 rounded-full hover:bg-white/5 disabled:opacity-50"
                    title="Upload Photo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </button>
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />
            </div>
        </div>
      </div>
    </div>
  );
};
