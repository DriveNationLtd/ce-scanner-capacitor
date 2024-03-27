
import { CameraDevice, Html5Qrcode } from 'html5-qrcode';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Camera } from '@capacitor/camera';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';


interface ScannerContextType {
    handleClickAdvanced: () => void;
    handleStop: () => void;
    scanLocalFile: () => void;
    scanFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileRef: React.RefObject<HTMLInputElement>;
    activeCameraId: string;
    scanResult: string;
    cameraList: CameraDevice[];
    isScanning: boolean;
    activeCamera: CameraDevice | undefined;
    qrCodeRef: React.RefObject<HTMLDivElement>;
    setElementMounted: React.Dispatch<React.SetStateAction<boolean>>;
    setScanResult: React.Dispatch<React.SetStateAction<string>>;
    handlePause: () => void;
}

const qrcodeRegionId = "reader";
let defaultConfig: Html5QrcodeScannerConfig = { qrbox: { width: 250, height: 250 }, fps: 40, aspectRatio: .7 }
let html5QrCode: Html5Qrcode;

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props?: Html5QrcodeScannerConfig): Html5QrcodeScannerConfig => {
    let config: Html5QrcodeScannerConfig = defaultConfig;

    if (!props) {
        return config;
    }

    if (props.fps) {
        config.fps = props.fps;
    }

    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }

    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }

    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }

    return config;
};

const ScannerContext = createContext<ScannerContextType | undefined>(undefined);

export const useScanner = (): ScannerContextType => {
    const context = useContext(ScannerContext);
    if (!context) {
        throw new Error('useDB must be used within a QRScannerProvider');
    }
    return context;
};


export const QRScannerProvider = ({ children }: { children: React.ReactNode }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const [elementMounted, setElementMounted] = useState(false);

    const [cameraList, setCameraList] = useState<CameraDevice[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [activeCamera, setActiveCamera] = useState<CameraDevice>();
    const [scanResult, setScanResult] = useState<string>('');

    useEffect(() => {
        // ask for permission to use the camera
        Camera.requestPermissions().then(() => {
            alert('Camera permission granted');
        }).catch(err => {
            console.log(err);
        });

        return () => {
            handleStop();
        }
    }, []);

    const onScanSuccess = (decodedText: string) => {
        setScanResult(decodedText);
    }

    const qrCodeSuccessCallback = (decodedText: string) => {
        setTimeout(() => {
            onScanSuccess(decodedText);
            handlePause();
        }, 1000);
    };

    useEffect(() => {
        const qrRegion = qrCodeRef.current;
        if (qrRegion) {
            // Element is rendered, you can perform actions here
            console.log('Element with ID qr-shaded-region is rendered');
            console.log(elementMounted);
            qrCodeRef.current.style.width = '100%';

        }
    }, [elementMounted]);

    const handleError = (errorMessage: string, error: Html5QrcodeError) => {
        // console.log('handleError', errorMessage, error);
    };

    const handleClickAdvanced = () => {
        let attempts = 0;
        const maxAttempts = 5;

        const _handleClickAdvanced = () => {
            if (attempts >= maxAttempts) {
                alert('Could not start scanning. Please try again');
                return;
            }

            if (qrCodeRef.current) {
                return startScanning();
            }

            console.log('Element not mounted yet');
            attempts++;
            setTimeout(_handleClickAdvanced, 1000);
        };

        // call recursively until element is mounted
        _handleClickAdvanced();
    };

    const startScanning = () => {
        html5QrCode = new Html5Qrcode(qrcodeRegionId);
        getCameras();
        const oldRegion = document.getElementById("qr-shaded-region");
        oldRegion && oldRegion.remove();

        if (isScanning) return;

        try {
            const config = createConfig();
            setIsScanning(true);

            html5QrCode.start(
                { facingMode: "environment" },
                // @ts-ignore
                config,
                qrCodeSuccessCallback,
                handleError
            ).then(() => {
                // const oldRegion = document.getElementById("qr-shaded-region");
                // if (oldRegion) oldRegion.innerHTML = "";
            });
        } catch (err) {
            console.error(err);
            setIsScanning(false);
        }
    }

    const getCameras = () => {
        Html5Qrcode.getCameras()
            .then((devices) => {
                /**
                 * devices would be an array of objects of type:
                 * { id: "id", label: "label" }
                 */
                if (devices && devices.length) {
                    setCameraList(devices);
                    setActiveCamera(devices[0]);
                }
            })
            .catch((err) => {
                console.error(err);
                setCameraList([]);
            });
    };

    const _onCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.selectedIndex) {
            let selectedCamera = e.target.options[e.target.selectedIndex];
            let cameraId = selectedCamera.dataset.key;
            setActiveCamera(cameraList.find((cam) => cam.id === cameraId));
        }
    };

    const handleStop = () => {
        setIsScanning(false);
        try {
            html5QrCode
                .stop()
                .then((res) => {
                    html5QrCode.clear();
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (err) {
            console.log(err);
        }
    };

    const handlePause = () => {
        try {
            html5QrCode.pause();
        } catch (err) {
            console.log(err);
        }
    };

    const scanLocalFile = () => {
        handleStop();

        if (!fileRef.current) return;
        fileRef.current.click();
    };

    const scanFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        if (e.target.files.length === 0) {
            // No file selected, ignore
            return;
        }

        // Use the first item in the list
        const imageFile = e.target.files[0];

        html5QrCode.scanFile(imageFile, /* showImage= */ true)
            .then((qrCodeMessage) => {
                onScanSuccess(qrCodeMessage);
                handleStop();
                html5QrCode.clear();
            })
            .catch((err) => {
                // failure, handle it.
                console.log(`Error scanning file. Reason: ${err}`);
            });
    };

    return (
        <ScannerContext.Provider value={{
            cameraList,
            isScanning,
            activeCamera,
            handleClickAdvanced,
            handleStop,
            scanLocalFile,
            scanFile,
            fileRef,
            activeCameraId: activeCamera?.id || '',
            scanResult,
            qrCodeRef,
            setElementMounted,
            setScanResult,
            handlePause
        }}>
            {children}
        </ScannerContext.Provider>
    );
}

export default QRScannerProvider;