import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import hospitalLogo from '../assets/images/afran-general-hospital-logo.jpg';
import { useLanguage } from '../context/LanguageContext';

export const QRCodePoster: React.FC = () => {
  const { t, language } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = 'https://afranfeedback.vercel.app';
    QRCode.toDataURL(url, {
      width: 600,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    }).then(setQrCodeUrl);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto no-print">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">QR Code Poster for Hospital Walls</h1>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Print Poster
          </button>
        </div>

        {/* Single Portrait Poster with All Languages */}
        <div
          ref={posterRef}
          className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:border-2 print:border-black"
        >
          <div className="text-center space-y-8 max-w-lg mx-auto">
            <img
              src={hospitalLogo}
              alt="Afran General Hospital Logo"
              className="w-48 h-48 mx-auto object-contain"
            />
            <h2 className="text-4xl font-black text-slate-900">{t.hospitalName}</h2>
            
            <div className="space-y-4">
              <p className="text-2xl font-bold text-slate-900">
                Scan to share complaint • suggestion • compliment feedback
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ስካን በማድረግ ቅሬታ • ሀሳብ • ምስጋና • አስተያየትዎን ያካፍሉ
              </p>
              <p className="text-2xl font-bold text-slate-900">
                Qabxii fayyadamiin komii • yaada • galmeessaa kenni
              </p>
            </div>

            <div className="my-12">
              <div className="bg-white p-6 rounded-2xl border-4 border-slate-300 inline-block">
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-96 h-96 mx-auto"
                  />
                )}
              </div>
            </div>

            <div className="pt-8 border-t-4 border-slate-300">
              <p className="text-lg font-bold text-slate-700">
                https://afranfeedback.vercel.app
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg no-print">
          <h3 className="font-semibold text-slate-900 mb-2">Printing Instructions:</h3>
          <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Click "Print Poster" button above</li>
            <li>Select A4 or Letter paper size</li>
            <li>Choose "Portrait" orientation</li>
            <li>Set margins to "Minimum" or "None"</li>
            <li>Laminate for durability in hospital areas</li>
          </ul>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 0.5cm;
          }
        }
      `}</style>
    </div>
  );
};
