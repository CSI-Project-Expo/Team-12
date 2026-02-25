import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [qrSrc, setQrSrc] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  const generateQR = async (value) => {
    if (!value) {
      setQrSrc('');
      setIsGenerated(false);
      return;
    }
    try {
      const url = await QRCode.toDataURL(value, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000ff',
          light: '#ffffffff'
        }
      });
      setQrSrc(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateClick = () => {
    if (text) {
      generateQR(text);
      setIsGenerated(true);
    }
  };

  useEffect(() => {
    if (isGenerated) {
      generateQR(text);
    }
  }, [text, isGenerated]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-3 text-indigo-600">
          <QrCode size={32} />
          <h1 className="text-3xl font-bold">QR Generator</h1>
        </div>
        
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="qr-input">
            Enter Text or URL
          </label>
          <input
            id="qr-input"
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
            placeholder="e.g. https://example.com"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {!isGenerated && (
          <button
            onClick={handleGenerateClick}
            disabled={!text}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all shadow-md ${text ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5' : 'bg-indigo-300 cursor-not-allowed'}`}
          >
            Generate QR
          </button>
        )}

        {isGenerated && qrSrc && (
          <div className="flex flex-col items-center space-y-6 w-full animate-fade-in-up transition-all duration-500">
            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm ring-1 ring-gray-900/5">
              <img src={qrSrc} alt="Generated QR Code" className="w-56 h-56 mx-auto" />
            </div>
            
            <a
              href={qrSrc}
              download="qrcode.png"
              className="flex items-center justify-center w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 space-x-2"
            >
              <Download size={20} />
              <span>Download QR</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;
