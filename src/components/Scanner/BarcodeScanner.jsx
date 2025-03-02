import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onScan }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (scanning) {
        Quagga.stop();
      }
    };
  }, [scanning]);

  useEffect(() => {
    startScanner();
  }, []);

  const startScanner = () => {
    if (scannerRef.current) {
      setScanning(true);
      
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 480,
            height: 320,
            facingMode: "environment"
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: ["ean_reader", "code_128_reader", "code_39_reader", "code_93_reader"]
        },
        locate: true
      }, function(err) {
        if (err) {
          setError(`Scanner initialization error: ${err}`);
          setScanning(false);
          return;
        }
        
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        if (result && result.codeResult) {
          const code = result.codeResult.code;
          onScan(code);
          
          // Flash effect to indicate successful scan
          if (scannerRef.current) {
            scannerRef.current.classList.add('flash');
            setTimeout(() => {
              if (scannerRef.current) {
                scannerRef.current.classList.remove('flash');
              }
            }, 300);
          }
        }
      });
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div 
        ref={scannerRef} 
        className="relative overflow-hidden rounded-lg border border-gray-300 bg-black"
        style={{ height: '320px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {!scanning && <p>Starting camera...</p>}
        </div>
        
        {/* Scanner guide overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full flex items-center justify-center">
            <div className="border-2 border-dashed border-blue-400 w-3/4 h-1/3 rounded-lg opacity-70"></div>
          </div>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 text-center">
        Position the barcode within the scanner area
      </p>
      
      <style jsx>{`
        .flash {
          animation: flash 0.3s;
        }
        
        @keyframes flash {
          0% { opacity: 1; }
          50% { opacity: 0.5; background: rgba(0, 255, 0, 0.2); }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner; 