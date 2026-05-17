import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";

const UploadFile = ({ file, onFileChange }) => {
  const { t } = useI18n();
  const [fileName, setFileName] = useState(file?.name || "");
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFileName(selectedFile?.name || "");
    onFileChange?.(selectedFile);
  };

  const clearFile = () => {
    setFileName("");
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-[24px] border border-dashed !border-[#dccfbc] !bg-[#fcfaf5] p-5 transition hover:!border-[#0b8c87]/40 hover:!bg-[#f7f5ef] sm:p-6">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] !bg-[#0b8c87]/10 !text-[#0b8c87]">
            {fileName ? (
              <FileText className="h-5 w-5" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </div>

          <div>
            <p className="text-base font-bold !text-[#243437]">
              {t("providerApplication.uploadTitle")}
            </p>
            <p className="mt-1 text-sm leading-6 !text-[#72726c]">
              {fileName || t("providerApplication.uploadHint")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {fileName ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full !border-[#d8c8b4] !bg-white px-4 !text-[#3a4a4d] hover:!bg-[#f6f3ed]"
              onClick={clearFile}
            >
              <X className="mr-2 h-4 w-4" />
              {t("providerApplication.removeFile")}
            </Button>
          ) : null}

          <Button
            type="button"
            variant="secondary"
            className="rounded-full !bg-[#0b8c87] px-5 !text-white hover:!bg-[#09726e]"
            onClick={() => inputRef.current?.click()}
          >
            {fileName
              ? t("providerApplication.changeFile")
              : t("providerApplication.chooseFile")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
