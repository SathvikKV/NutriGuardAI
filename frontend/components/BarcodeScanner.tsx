"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface ValidatedScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
}

const BarcodeScanner = ({ onScanSuccess, onScanFailure }: ValidatedScannerProps) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear();
                onScanSuccess(decodedText);
            },
            (error) => {
                if (onScanFailure) onScanFailure(error);
            }
        );

        return () => {
            scanner.clear().catch((error) => console.error("Failed to clear scanner", error));
        };
    }, [onScanSuccess, onScanFailure]);

    return <div id="reader" className="w-full max-w-sm mx-auto"></div>;
};

export default BarcodeScanner;
