import { useCallback, useEffect, useState } from 'react';

// Server actions
import { verifyScan } from '../../actions/VerifyScan';

// Scanner library
import { Html5QrcodeError } from 'html5-qrcode/esm/core';

// Components
import { ScanResult } from './ScanResult';
import { Html5QRScanner } from './Html5QRScanner';
import Modal from '../../shared/Modal';
import Loader from '../../shared/Loader';
import { TicketScanResponse } from '../../types/event';
import { useScanner } from '../../context/QRScannerProvider';
import { Html5Qrcode } from 'html5-qrcode';
import { ThemeBtn } from '../../shared/ThemeBtn';


interface QRScannerProps {
}

const QRScanner: React.FC<QRScannerProps> = ({ }) => {
    const [result, setResult] = useState<TicketScanResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    // const { qrCodeRef, setElementMounted, scanFile, scanResult, fileRef, scanLocalFile, handleClickAdvanced, isScanning, setScanResult } = useScanner();

    // useEffect(() => {
    //     if (qrCodeRef?.current) {
    //         setElementMounted(true);
    //     }

    //     return () => {
    //         setElementMounted(false);
    //         setScanResult('');
    //     };
    // }, [qrCodeRef, result]);

    // useEffect(() => {
    //     if (scanResult && !loading) {
    //         onScanSuccess(scanResult);
    //         setScanResult('');
    //     }
    // }, [scanResult]);

    const onScanSuccess = async (decodedText: string) => {
        if (loading || result) return;
        setLoading(true);
        const response = await verifyScan(decodedText);
        setLoading(false);
        setResult(response);
    }

    // return (
    //     <>
    //         {loading && <Loader />}
    //         {!result && (
    //             <>
    //                 <div id="reader" className="h-full w-full text-black flex flex-col items-center justify-center" ref={qrCodeRef}>
    //                     <div className="p-4 bg-white rounded-lg shadow-lg">
    //                         <svg className="animate-spin h-12 w-12 text-gray-600 mx-auto" viewBox="0 0 24 24">
    //                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    //                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8 8 0 0112 4V0C6.486 0 2 4.486 2 10h4zm6 6.627A8 8 0 0014 20v4c5.627 0 10-4.473 10-10h-4zm-6 5.373A8 8 0 004 12h-4c0 5.627 4.473 10 10 10v-4z"></path>
    //                         </svg>
    //                         <div className="mt-4 text-center">Initializing Scanner...</div>
    //                     </div>
    //                 </div>
    //                 <div className='flex justify-between px-3 py-4'>
    //                     <ThemeBtn onClick={scanLocalFile}>
    //                         Scan File
    //                     </ThemeBtn>
    //                 </div>

    //                 <input
    //                     type="file"
    //                     accept="image/*"
    //                     ref={fileRef}
    //                     onChange={scanFile}
    //                     style={{ display: "none" }}
    //                 />
    //             </>
    //         )}
    //         <ScanResult result={result} callback={(val) => {
    //             setResult(val);
    //             handleClickAdvanced();
    //         }} />
    //     </>
    // );

    return (
        <>
            {loading && <Loader />}
            {!result && (
                <Html5QRScanner
                    onScanSuccess={onScanSuccess}
                    handleError={(errorMessage: string, error: Html5QrcodeError) => {
                    }}
                    startScanning={true}
                />

            )}
            <ScanResult result={result} callback={setResult} />

        </>
    );
};

export default QRScanner;