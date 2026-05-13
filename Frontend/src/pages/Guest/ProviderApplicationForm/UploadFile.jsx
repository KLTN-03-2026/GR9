import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud, X } from "lucide-react";
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
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 transition hover:border-primary/40 hover:bg-teal-50/30">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {fileName ? <FileText className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">
              {t("providerApplication.uploadTitle")}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {fileName || t("providerApplication.uploadHint")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {fileName ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={clearFile}
            >
              <X className="mr-2 h-4 w-4" />
              {t("providerApplication.removeFile")}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl"
            onClick={() => inputRef.current?.click()}
          >
            {fileName ? t("providerApplication.changeFile") : t("providerApplication.chooseFile")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
