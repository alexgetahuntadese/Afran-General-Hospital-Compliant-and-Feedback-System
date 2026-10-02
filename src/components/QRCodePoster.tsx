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
      width: 400,
      margin: 2,
      color: {
        dark: '#03045e',
        light: '#ffffff',
      },
    }).then(setQrCodeUrl);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">QR Code Posters for Hospital Walls</h1>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Print Posters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Poster 1 - English */}
          <div
            ref={posterRef}
            className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:border-2 print:border-black"
          >
            <div className="text-center space-y-6">
              <img
                src={hospitalLogo}
                alt="Afran General Hospital Logo"
                className="w-32 h-32 mx-auto object-contain"
              />
              <h2 className="text-3xl font-bold text-slate-900">{t.hospitalName}</h2>
              <p className="text-lg text-slate-600">{t.patientRelations}</p>
              
              <div className="my-8">
                <div className="bg-white p-4 rounded-xl border-2 border-slate-200 inline-block">
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-64 h-64 mx-auto"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-900">
                  Scan to Share Your Feedback
                </p>
                <p className="text-base text-slate-600">
                  Complaint • Suggestion • Compliment
                </p>
                <p className="text-sm text-slate-500 mt-4">
                  Your voice matters. Help us improve your experience.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  https://afranfeedback.vercel.app
                </p>
              </div>
            </div>
          </div>

          {/* Poster 2 - Amharic */}
          <div className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:border-2 print:border-black">
            <div className="text-center space-y-6">
              <img
                src={hospitalLogo}
                alt="Afran General Hospital Logo"
                className="w-32 h-32 mx-auto object-contain"
              />
              <h2 className="text-3xl font-bold text-slate-900">አፍራን ጠቅላይ ሆስፒታል</h2>
              <p className="text-lg text-slate-600">የተቀባይነት ግንኙነት</p>
              
              <div className="my-8">
                <div className="bg-white p-4 rounded-xl border-2 border-slate-200 inline-block">
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-64 h-64 mx-auto"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-900">
                  ለመቀረፍ ይቃኙ
                </p>
                <p className="text-base text-slate-600">
                  ቅሬታ • ሀሳብ • ምስጋና
                </p>
                <p className="text-sm text-slate-500 mt-4">
                  ድምፅዎ አስፈላጊ ነው። እንዲሻሻልን ይርዳን።
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  https://afranfeedback.vercel.app
                </p>
              </div>
            </div>
          </div>

          {/* Poster 3 - Afaan Oromoo */}
          <div className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:border-2 print:border-black">
            <div className="text-center space-y-6">
              <img
                src={hospitalLogo}
                alt="Afran General Hospital Logo"
                className="w-32 h-32 mx-auto object-contain"
              />
              <h2 className="text-3xl font-bold text-slate-900">Hospitaalii Afran Guddittii</h2>
              <p className="text-lg text-slate-600">Waldhoreessii Faa'ii</p>
              
              <div className="my-8">
                <div className="bg-white p-4 rounded-xl border-2 border-slate-200 inline-block">
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-64 h-64 mx-auto"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-900">
                  Qabxii fayyadamiin qabxi
                </p>
                <p className="text-base text-slate-600">
                  Komii • Yaada • Galmeessaa
                </p>
                <p className="text-sm text-slate-500 mt-4">
                    Sagaleen keessan gaarii. Jaalalli keenya cabsi.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  https://afranfeedback.vercel.app
                </p>
              </div>
            </div>
          </div>

          {/* Poster 4 - Simple/Minimal */}
          <div className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:border-2 print:border-black">
            <div className="text-center space-y-6">
              <img
                src={hospitalLogo}
                alt="Afran General Hospital Logo"
                className="w-24 h-24 mx-auto object-contain"
              />
              
              <div className="my-6">
                <div className="bg-white p-4 rounded-xl border-2 border-slate-200 inline-block">
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-72 h-72 mx-auto"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  {t.hospitalName}
                </h2>
                <p className="text-lg font-semibold text-blue-700">
                  Scan to Share Feedback
                </p>
                <p className="text-sm text-slate-500">
                  ስካን በማድረግ አስተያየትዎን ያካፍሉ
                </p>
                <p className="text-sm text-slate-500">
                  Qabxii fayyadamiin yaada kenni
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-400">
                  https://afranfeedback.vercel.app
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-2">Printing Instructions:</h3>
          <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Click "Print Posters" button above</li>
            <li>Select A4 or Letter paper size</li>
            <li>Choose "Landscape" orientation for better fit</li>
            <li>Set margins to "Minimum" or "None"</li>
            <li>Print 2 copies (2 posters per page)</li>
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
