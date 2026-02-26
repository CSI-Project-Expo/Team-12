import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2, Camera, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QRCodeScanner({ onScanSuccess }) {
    const scannerRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        let html5QrCode;

        const initializeScanner = async () => {
            try {
                // Request camera permissions first
                const hasCamera = await Html5Qrcode.getCameras();
                if (hasCamera && hasCamera.length > 0) {
                    html5QrCode = new Html5Qrcode("qr-reader");

                    await html5QrCode.start(
                        { facingMode: "environment" },
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                            aspectRatio: 1.0
                        },
                        (decodedText) => {
                            // On success, stop scanning and pass value up
                            if (html5QrCode.isScanning) {
                                html5QrCode.stop().then(() => {
                                    setIsScanning(false);
                                    onScanSuccess(decodedText);
                                }).catch((err) => {
                                    console.error("Failed to stop scanner after success", err);
                                    // Even if stop fails, we should still call success
                                    onScanSuccess(decodedText);
                                });
                            }
                        },
                        (errorMessage) => {
                            // Ignore frame-by-frame read errors (these happen constantly as it looks for a code)
                        }
                    );
                    setIsScanning(true);
                    setInitializing(false);
                } else {
                    setError("No cameras found on this device.");
                    setInitializing(false);
                }
            } catch (err) {
                console.error("Camera access error:", err);
                setError("Camera permission denied or camera not available.");
                setInitializing(false);
            }
        };

        initializeScanner();

        return () => {
            // Cleanup on unmount
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(console.error);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/50 shadow-xl relative">

            {initializing && !error && (
                <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center min-h-[300px]">
                    <Loader2 size={32} className="animate-spin text-emerald-500 mb-4" />
                    <p className="text-sm font-medium text-slate-300">Activating camera...</p>
                    <p className="text-xs text-slate-500 mt-2">Please allow camera permissions</p>
                </div>
            )}

            {error ? (
                <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <AlertCircle size={32} className="text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Camera Error</h3>
                    <p className="text-sm text-slate-400">{error}</p>
                </div>
            ) : (
                <div className="relative">
                    {/* The div id must match the one passed to new Html5Qrcode() */}
                    <div id="qr-reader" className="w-full bg-black min-h-[300px]"></div>

                    {/* Overlay styling for the scanner area */}
                    <div className="absolute inset-0 pointer-events-none custom-scanner-overlay">
                        {isScanning && (
                            <motion.div
                                className="w-full h-1 bg-emerald-500/50 absolute top-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        )}
                    </div>
                </div>
            )}

            <style>{`
                #qr-reader video {
                    object-fit: cover;
                }
            `}</style>
        </div>
    );
}
