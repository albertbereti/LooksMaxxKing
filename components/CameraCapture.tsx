
import React, { useRef, useEffect, useState } from 'react';
import { compressImage, readFileAsBase64 } from '../utils/imageUtils';
import { getHistory } from '../services/historyService';

interface CameraCaptureProps {
  onCapture: (image: string, email?: string, phone?: string) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);

  const [streamActive, setStreamActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showGhost, setShowGhost] = useState(false);
  const [ghostImage, setGhostImage] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    const history = getHistory();
    if (history.length > 0) {
      // Find the most recent scan image if available (not stored in simple history currently, 
      // but we'll try to find a session cached one if we had it. For now, we'll assume we can't 
      // unless we passed it. Let's just use the first scan's thumbnail if we had a persistent storage for it).
    }
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (!mountedRef.current) return;
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("Blocked");

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } }
        });

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (mountedRef.current && videoRef.current) {
              videoRef.current.play()
                .then(() => { if (mountedRef.current) setStreamActive(true); })
                .catch(() => setCameraError("TAP TO ENABLE"));
            }
          };
        }
      } catch (err: any) {
        if (!mountedRef.current) return;
        setCameraError("TAP TO UPLOAD");
      }
    };
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, []);

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current && streamActive) {
      setIsProcessing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
        ctx.drawImage(video, (video.videoWidth - size) / 2, (video.videoHeight - size) / 2, size, size, 0, 0, size, size);
        const raw = canvas.toDataURL('image/jpeg', 0.85);
        const comp = await compressImage(raw);
        onCapture(comp);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-[150] bg-black flex flex-col overflow-hidden animate-fade-in">
      <div className="relative flex-grow bg-zinc-950 overflow-hidden">
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">CAMERA BLOCKED</h3>
            <button onClick={() => fileInputRef.current?.click()} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs">UPLOAD PHOTO</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 grayscale brightness-75 ${isProcessing ? 'blur-2xl' : ''}`} />
            {showGhost && ghostImage && (
              <img src={ghostImage} className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-30 pointer-events-none mix-blend-screen" alt="ghost" />
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />

        {/* HUD Frame */}
        {!isProcessing && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
            <div className="w-full max-w-[300px] aspect-[1/1] rounded-[4rem] border-2 border-amber-500/20 relative">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-amber-500/40 animate-scan"></div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xl z-30">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-xs font-black uppercase tracking-[0.3em] mt-6">RATING FACE...</p>
          </div>
        )}

        <button onClick={onCancel} className="absolute top-6 right-6 z-40 bg-zinc-900/80 p-3 rounded-full text-white border border-white/10">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Ghost Toggle */}
        {ghostImage && !isProcessing && (
          <button
            onClick={() => setShowGhost(!showGhost)}
            className={`absolute bottom-32 left-6 z-40 p-4 rounded-2xl border transition-all ${showGhost ? 'bg-amber-500 text-black border-amber-500' : 'bg-black/60 text-white border-white/10'}`}
          >
            <span className="text-[8px] font-black uppercase tracking-widest">Ghost Overlay</span>
          </button>
        )}
      </div>

      <div className="flex-none bg-[#050505] p-8 flex flex-col items-center gap-6 pb-[env(safe-area-inset-bottom)]">
        <div className="w-full flex justify-between items-center max-w-sm">
          <button onClick={() => fileInputRef.current?.click()} className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col items-center justify-center text-zinc-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                try {
                  const raw = await readFileAsBase64(f);
                  const compressed = await compressImage(raw);
                  onCapture(compressed);
                } catch (err) {
                  console.error("Image processing failed:", err);
                }
              }
            }} />
          </button>

          <button onClick={handleCapture} disabled={!streamActive || isProcessing} className="w-20 h-20 rounded-full border-[8px] border-zinc-900 bg-white active:bg-amber-400 transition-all shadow-2xl disabled:opacity-20" />

          <div className="w-14 h-14 flex items-center justify-center opacity-40">
            <div className={`w-3 h-3 rounded-full ${streamActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
