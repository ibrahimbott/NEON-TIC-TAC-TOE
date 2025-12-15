import React, { useEffect, useState } from 'react';
import { Bluetooth, Smartphone, Wifi, Loader2 } from 'lucide-react';

interface ScannerProps {
  onConnected: () => void;
  onCancel: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onConnected, onCancel }) => {
  const [status, setStatus] = useState<string>('Initializing Bluetooth adapter...');
  const [devices, setDevices] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate a scanning process sequence
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    timeouts.push(setTimeout(() => {
        setStatus('Scanning for nearby devices...');
        setProgress(20);
    }, 1000));

    timeouts.push(setTimeout(() => {
        setDevices(['Unknown Device', 'Galaxy S23', 'iPhone 15']);
        setStatus('Found 3 devices in range...');
        setProgress(50);
    }, 2500));

    timeouts.push(setTimeout(() => {
        setStatus('Handshaking with nearby player...');
        setProgress(80);
    }, 4500));

    timeouts.push(setTimeout(() => {
        setStatus('Connected via Local Secure Channel.');
        setProgress(100);
        setTimeout(onConnected, 800);
    }, 6000));

    return () => timeouts.forEach(clearTimeout);
  }, [onConnected]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 p-6">
      
      {/* Radar Animation */}
      <div className="relative flex items-center justify-center w-64 h-64">
         <div className="absolute inset-0 bg-neonBlue/10 rounded-full animate-ping-slow"></div>
         <div className="absolute inset-4 bg-neonBlue/20 rounded-full animate-pulse"></div>
         <div className="absolute inset-0 border-2 border-neonBlue/50 rounded-full"></div>
         
         {/* Rotating Scanner Line */}
         <div className="absolute inset-0 rounded-full animate-spin-slow border-t-4 border-neonBlue shadow-[0_0_20px_#00f3ff]"></div>

         <Bluetooth className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10" />
      </div>

      <div className="space-y-2 max-w-xs w-full">
        <h2 className="text-2xl font-bold tracking-wider text-neonBlue">NEARBY CONNECT</h2>
        <p className="text-gray-400 text-sm animate-pulse">{status}</p>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-gradient-to-r from-neonBlue to-neonPurple transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 w-full max-w-xs text-left">
         {devices.map((device, idx) => (
             <div key={idx} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 animate-fade-in-up">
                 {idx === 1 ? <Smartphone className="text-neonPurple w-4 h-4" /> : <Wifi className="text-gray-500 w-4 h-4" />}
                 <span className="text-sm text-gray-300">{device}</span>
                 {progress > 50 && idx === 1 && <span className="ml-auto text-xs text-green-400">Pairing...</span>}
             </div>
         ))}
      </div>

      <button 
        onClick={onCancel}
        className="mt-8 px-6 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition"
      >
        Cancel Scan
      </button>
    </div>
  );
};

export default Scanner;