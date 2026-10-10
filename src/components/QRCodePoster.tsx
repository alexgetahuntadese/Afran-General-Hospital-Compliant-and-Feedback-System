import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import hospitalLogo from '../assets/images/afran-general-hospital-logo.jpg';
import { useLanguage } from '../context/LanguageContext';

const PUBLIC_FEEDBACK_URL = 'https://afranfeedback.vercel.app';

export const QRCodePoster: React.FC = () => {
  const { t, language } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [qrError, setQrError] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(PUBLIC_FEEDBACK_URL, {
      width: 600,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then(setQrCodeUrl)
      .catch(() => setQrError(true));
  }, []);

  const handlePrint = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    document.body.classList.add('printing-qr-poster');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-qr-poster');
      setIsPrinting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between no-print">
          <h1 className="text-2xl font-bold text-slate-900">QR Code Poster for Hospital Walls</h1>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isPrinting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isPrinting ? 'Printing...' : 'Print Poster'}
          </button>
        </div>

        {/* Single Portrait Poster with All Languages */}
        <div
          ref={posterRef}
          className="qr-poster-print bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:border-0 print:p-12"
        >
          <div className="text-center space-y-8 max-w-lg mx-auto">
            <img
              src={hospitalLogo}
              alt="Afran General Hospital Logo"
              className="w-48 h-48 mx-auto object-contain"
            />
            <h2 className="text-4xl font-black text-slate-900">{t.hospitalName}</h2>

            <div className="space-y-4">
              <p className="qr-amharic text-3xl font-black leading-tight text-slate-900">
                ስካን በማድረግ ቅሬታ • ሀሳብ • ምስጋና • አስተያየትዎን ያካፍሉ
              </p>
              <p className="text-2xl font-black leading-tight text-slate-900">
                SCANII GOCHUDHAAN • YAADA • KOMII • JECHA BARBAADDAN NUUF QOODAA
              </p>
              <p className="text-2xl font-black leading-tight text-slate-900">
                Scan to share complaint • suggestion • compliment feedback
              </p>
            </div>

            <div className="my-8 rounded-2xl border-4 border-[#03045e] bg-[#ffdd57] px-4 py-5 shadow-xl print:my-4 print:px-3 print:py-3">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#03045e] print:text-xs">Open on your phone</p>
              <a
                href={PUBLIC_FEEDBACK_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block whitespace-nowrap text-[clamp(1.25rem,4.5vw,2.75rem)] font-black leading-tight tracking-tight text-[#03045e] underline decoration-4 underline-offset-4 print:text-[2.2rem]"
              >
                afranfeedback.vercel.app
              </a>
            </div>

            <div className="my-12">
              <div className="bg-white p-8 rounded-2xl border-4 border-slate-300 inline-block print:border-0 print:p-0">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="h-[min(82vw,28rem)] w-[min(82vw,28rem)] mx-auto print:h-[460px] print:w-[460px]"
                  />
                ) : qrError ? (
                  <div className="h-[min(82vw,28rem)] w-[min(82vw,28rem)] mx-auto flex items-center justify-center text-red-600 text-center">
                    <p className="text-sm">Failed to generate QR code</p>
                  </div>
                ) : (
                  <div className="h-[min(82vw,28rem)] w-[min(82vw,28rem)] mx-auto flex items-center justify-center text-slate-400">
                    <p className="text-sm">Loading QR code...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t-4 border-slate-300">
              <p className="text-base font-black text-slate-700">Scan the code or type the website above</p>
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
          body.printing-qr-poster > * {
            visibility: hidden !important;
          }
          body.printing-qr-poster .qr-poster-print,
          body.printing-qr-poster .qr-poster-print * {
            visibility: visible !important;
          }
          body.printing-qr-poster .qr-poster-print {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 0.3cm;
          }
          .print-page-break {
            page-break-after: always;
          }
          img {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Reduce spacing for print */
          .min-h-screen {
            min-height: auto !important;
          }
          .p-8 {
            padding: 0.5rem !important;
          }
          .space-y-8 > * + * {
            margin-top: 1rem !important;
          }
          .space-y-4 > * + * {
            margin-top: 0.5rem !important;
          }
          .my-12 {
            margin-top: 1rem !important;
            margin-bottom: 1rem !important;
          }
          .my-8 {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          .text-4xl {
            font-size: 1.75rem !important;
          }
          .text-2xl {
            font-size: 1.25rem !important;
          }
          .qr-amharic {
            font-size: 1.55rem !important;
            font-weight: 900 !important;
          }
          .text-lg {
            font-size: 1rem !important;
          }
          .w-48 {
            width: 8rem !important;
          }
          .h-48 {
            height: 8rem !important;
          }
          .border-4 {
            border-width: 2px !important;
          }
          .border-t-4 {
            border-top-width: 2px !important;
          }
        }
      `}</style>
    </div>
  );
};
