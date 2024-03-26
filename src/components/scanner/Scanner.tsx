import { useState } from 'react';

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


interface QRScannerProps {
}

const QRScanner: React.FC<QRScannerProps> = ({ }) => {
    const [result, setResult] = useState<TicketScanResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onScanSuccess = async (decodedText: string) => {
        setLoading(true);
        const response = await verifyScan(decodedText);
        setLoading(false);
        setResult(response);
    };

    const handleError = (errorMessage: string, error: Html5QrcodeError) => {
        // console.log('handleError', errorMessage, error);
    };

    return (
        <>
            {loading && <Loader />}
            {!result && (
                <Html5QRScanner
                    onScanSuccess={onScanSuccess}
                    handleError={handleError}
                    startScanning={true}
                />
            )}
            <ScanResult result={result} callback={setResult} />
            {/* <Modal isOpen={result ? true : false} onClose={() => setResult(null)} title='Results'>
            </Modal> */}
        </>
    );
};

export default QRScanner;