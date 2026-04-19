import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

const UploadFile = ({ file, onFileChange }) => {
  const [fileName, setFileName] = useState(file?.name || "");
  const inputRef = useRef(null);

  const handleSelectClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFileName(selectedFile?.name || "");
    onFileChange?.(selectedFile);
  };

  return (
    <div className="group relative border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:bg-slate-50 hover:border-primary/40 transition-all text-center">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <UploadCloud className="text-primary w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg">Giấy phép kinh doanh</p>
          <p className="text-sm text-muted-foreground">
            {fileName
              ? `Tệp đã chọn: ${fileName}`
              : "Tải lên file PDF hoặc ảnh (Max 10MB)"}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleSelectClick}>
          {fileName ? "Thay đổi tệp" : "Chọn tệp tin"}
        </Button>
      </div>
    </div>
  );
};

export default UploadFile;
