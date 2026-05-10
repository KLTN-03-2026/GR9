import { useState } from "react";
import {
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const isImageDocument = (doc) =>
  doc.fileType?.startsWith("image/") ||
  /\.(jpe?g|png|gif|webp|avif)$/i.test(doc.url || "");

const isPdfDocument = (doc) =>
  doc.fileType === "application/pdf" ||
  /\.pdf(\?|$)/i.test(doc.url || "") ||
  /\.pdf$/i.test(doc.name || "");

const getCloudinaryPdfPreviewUrl = (doc) => {
  const url = doc.cloudinaryUrl || doc.url || "";

  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return null;
  }

  return url.replace("/image/upload/", "/image/upload/f_jpg,pg_1/");
};

const getDownloadFileName = (doc) => {
  const fallbackExtension = isPdfDocument(doc) ? "pdf" : "file";
  const rawName = doc.name || `provider-document.${fallbackExtension}`;
  const hasExtension = /\.[a-z0-9]{2,8}$/i.test(rawName);
  return hasExtension ? rawName : `${rawName}.${fallbackExtension}`;
};

const downloadDocument = async (doc) => {
  const response = await fetch(doc.url);
  const blob = await response.blob();
  const typedBlob = new Blob([blob], {
    type: doc.fileType || blob.type || "application/octet-stream",
  });
  const objectUrl = URL.createObjectURL(typedBlob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = getDownloadFileName(doc);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};

const ProviderApprovalCard = ({ provider, onApprove, onReject }) => {
  const [showDetails, setShowDetails] = useState(false);
  const documents = provider.documents || [];
  const hasDocuments = documents.length > 0;

  const renderDocumentPreview = (doc) => {
    if (!doc.url) {
      return (
        <div className="rounded-2xl bg-slate-100 p-5 text-sm font-semibold text-slate-500">
          Tài liệu này chưa có đường dẫn Cloudinary.
        </div>
      );
    }

    if (isImageDocument(doc)) {
      return (
        <img
          src={doc.url}
          alt={doc.name || "Provider document"}
          className="max-h-80 w-full rounded-2xl border border-slate-200 bg-white object-contain"
        />
      );
    }

    if (isPdfDocument(doc)) {
      const previewUrl = getCloudinaryPdfPreviewUrl(doc);

      return (
        <div className="space-y-3">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={doc.name || "Provider PDF preview"}
              className="max-h-[640px] w-full rounded-2xl border border-slate-200 bg-white object-contain"
            />
          ) : (
            <iframe
              src={`${doc.url}#toolbar=1&navpanes=0`}
              title={doc.name || "Provider document"}
              className="h-[520px] w-full rounded-2xl border border-slate-200 bg-white"
            />
          )}
          <p className="text-xs font-semibold text-slate-500">
            Nếu preview PDF không hiển thị, bấm "Mở" hoặc "Tải về" để kiểm tra file gốc.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl bg-slate-100 p-5 text-sm font-semibold text-slate-600">
        Không hỗ trợ preview trực tiếp. Vui lòng mở tài liệu ở tab mới.
      </div>
    );
  };

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <UserRound className="h-9 w-9" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h4 className="text-xl font-black text-slate-900">
                  {provider.fullName || provider.name || "Provider application"}
                </h4>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                  {provider.email ? (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-4 w-4 text-teal-600" />
                      {provider.email}
                    </span>
                  ) : null}
                  {provider.phone ? (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-4 w-4 text-teal-600" />
                      {provider.phone}
                    </span>
                  ) : null}
                  {provider.address ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      {provider.address}
                    </span>
                  ) : null}
                </div>
              </div>

              <Badge className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                Pending review
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Gender
                </p>
                <p className="mt-1 font-bold text-slate-900">{provider.gender || "OTHER"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Submitted
                </p>
                <p className="mt-1 font-bold text-slate-900">
                  {provider.createdAt
                    ? new Date(provider.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Documents
                </p>
                <p className="mt-1 font-bold text-slate-900">{documents.length}</p>
              </div>
            </div>

            {hasDocuments ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {documents.map((doc, index) => (
                  <a
                    key={`${doc.url || doc.name}-${index}`}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100"
                  >
                    <FileText className="h-4 w-4" />
                    {doc.name || `Document ${index + 1}`}
                  </a>
                ))}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
              <Button
                onClick={onApprove}
                className="rounded-full bg-teal-600 px-7 font-bold text-white hover:bg-teal-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={onReject}
                variant="secondary"
                className="rounded-full bg-rose-50 px-7 font-bold text-rose-700 hover:bg-rose-100"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                variant="link"
                className="ml-auto px-0 font-bold text-teal-700"
                onClick={() => setShowDetails((prev) => !prev)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showDetails ? "Ẩn tài liệu" : "Xem tài liệu"}
              </Button>
            </div>

            {showDetails ? (
              <div className="mt-6 space-y-4">
                {hasDocuments ? (
                  documents.map((doc, index) => (
                    <div
                      key={`${doc.url || doc.name}-preview-${index}`}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-bold text-slate-900">
                            {doc.name || `Document ${index + 1}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            {doc.fileType || "Cloudinary file"}
                          </p>
                        </div>
                        {doc.url ? (
                          <div className="flex gap-2">
                            <Button asChild variant="outline" className="rounded-xl">
                              <a href={doc.url} target="_blank" rel="noreferrer">
                                <Eye className="mr-2 h-4 w-4" />
                                Mở
                              </a>
                            </Button>
                            <Button
                              type="button"
                              className="rounded-xl bg-teal-600 text-white hover:bg-teal-700"
                              onClick={() => downloadDocument(doc)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Tải về
                            </Button>
                          </div>
                        ) : null}
                      </div>
                      {renderDocumentPreview(doc)}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                    Hồ sơ này chưa có tài liệu xác minh.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderApprovalCard;
