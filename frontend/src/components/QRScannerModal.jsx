import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Modal from './common/Modal';
import { CameraIcon, StopIcon } from '@heroicons/react/24/outline';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [manualCode, setManualCode] = useState('');
  const qrRef = useRef(null);
  const scannerInstance = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setManualCode('');
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      if (!qrRef.current) return;
      if (scannerInstance.current) {
        try {
          await scannerInstance.current.stop();
        } catch (_) {}
      }

      const html5QrCode = new Html5Qrcode('qr-reader-container');
      scannerInstance.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          handleDetected(decodedText);
        },
        () => {
          // Frame errors during scan can be ignored
        }
      );
      setScanning(true);
    } catch (err) {
      setErrorMsg('Camera access failed or no camera device found. You can simulate barcode/QR entry below.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerInstance.current) {
      try {
        await scannerInstance.current.stop();
      } catch (_) {}
      scannerInstance.current = null;
    }
    setScanning(false);
  };

  const handleDetected = async (code) => {
    await stopScanner();
    onScanSuccess(code);
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleDetected(manualCode.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Barcode & QR Code Scanner" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="relative bg-slate-900 rounded-lg overflow-hidden flex flex-col items-center justify-center min-h-[260px] text-white">
          <div id="qr-reader-container" ref={qrRef} className="w-full"></div>
          {!scanning && errorMsg && (
            <div className="p-4 text-center text-xs text-slate-300">
              <CameraIcon className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              {errorMsg}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Manual Barcode / SKU Entry
          </p>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. SKU-EL-001 or A-1-1"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-slate-800 text-white rounded hover:bg-slate-700 transition"
            >
              Lookup
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
