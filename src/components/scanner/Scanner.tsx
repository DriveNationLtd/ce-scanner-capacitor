import { useState } from 'react';

// Server actions
import { verifyScan } from '../../actions/VerifyScan';

// Scanner library
import { Html5QrcodeError } from 'html5-qrcode/esm/core';

// Components
import { ScanResult } from './ScanResult';
import { Html5QRScanner } from './Html5QRScanner';
import Loader from '../../shared/Loader';
import { TicketScanResponse } from '../../types/event';
import { verifyScanLocally } from '../../utils/db';
import { useDB } from '../../context/DBProvider';

interface QRScannerProps {
}

const QRScanner: React.FC<QRScannerProps> = ({ }) => {
    const { db } = useDB();
    const [result, setResult] = useState<TicketScanResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onScanSuccess = async (decodedText: string) => {
        if (!db) return alert('Database not available');

        if (loading || result) return;
        setLoading(true);
        // const response = await verifyScan(decodedText);
        const response = await verifyScanLocally(db, decodedText);
        setLoading(false);
        setResult(response);
    }

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