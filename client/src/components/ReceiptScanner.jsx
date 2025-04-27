import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ReceiptScanner = ({ onScanComplete }) => {
  const fileInputRef = useRef(null);
  const { scanReceipt } = useContext(AppContext);

  const [scanLoading, setScanLoading] = useState(false);
  const [scannedData, setScannedData] = useState([]);

  const handleScriptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    setScanLoading(true);
    const result = await scanReceipt(file);
    if (result?.success) {
      setScannedData(result?.data);
    }
    setScanLoading(false);
  };

  useEffect(() => {
    if (scannedData && !scanLoading) {
      onScanComplete(scannedData);
    }
  }, [scanLoading, scannedData]);

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleScriptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanLoading}
        className="cursor-pointer w-full py-5 ai-gradient text-white hover:text-white flex items-center justify-center"
      >
        <>
          {scanLoading ? (
            <>
              <Loader2 className="mr-2 animate-spin" />
              <span>Scanning Receipt</span>
            </>
          ) : (
            <>
              <Camera className="mr-2" />
              <span>Scan Receipt With AI</span>
            </>
          )}
        </>
      </Button>
    </div>
  );
};

export default ReceiptScanner;
