import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProviderApprovalCard = ({ provider, onApprove, onReject }) => {
  const [showDetails, setShowDetails] = useState(false);
  const documents = provider.documents || [];
  const hasDocuments = documents.length > 0;

  const renderDocumentPreview = (doc, index) => {
    const documentUrl = doc.url || doc.imageUrl || doc.imageURL || "";
    if (!documentUrl) {
      return (
        <p className="text-sm text-slate-500">Không có đường dẫn tài liệu.</p>
      );
    }

    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(documentUrl);
    const isPdf = /\.pdf$/i.test(documentUrl);

    if (isImage) {
      return (
        <img
          src={documentUrl}
          alt={doc.name}
          className="w-full max-h-72 object-contain rounded-3xl border border-slate-200"
        />
      );
    }

    if (isPdf) {
      return (
        <iframe
          src={documentUrl}
          title={doc.name}
          className="w-full h-72 rounded-3xl border border-slate-200"
        />
      );
    }

    return (
      <a
        href={documentUrl}
        target="_blank"
        rel="noreferrer"
        className="text-teal-600 underline"
      >
        Mở tài liệu: {doc.name}
      </a>
    );
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200/60 hover:ring-teal-600/20 transition-all group">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-20 h-20 rounded-xl bg-slate-50 shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
            <img
              src={provider.logoUrl || "https://via.placeholder.com/80"}
              alt={`${provider.name} Logo`}
              className="object-contain p-2"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {provider.name || provider.fullName}
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  {provider.description}
                </p>
              </div>

              <Badge
                variant="outline"
                className={`uppercase tracking-wider text-[10px] px-3 py-1 rounded-full border-none font-bold ${
                  provider.isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {provider.isActive ? "Active Provider" : "Pending Review"}
              </Badge>
            </div>

            {hasDocuments && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-600 text-sm">
                      {doc.icon || "description"}
                    </span>
                    <label className="text-xs font-semibold text-slate-600 truncate cursor-default">
                      {doc.name}
                    </label>
                    {doc.verified ? (
                      <span
                        className="material-symbols-outlined text-teal-500 text-xs"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-500 font-bold italic">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-sm text-slate-500 flex flex-wrap gap-4">
              {provider.email && <span>Email: {provider.email}</span>}
              {provider.createdAt && (
                <span>
                  Ngày nộp:{" "}
                  {new Date(provider.createdAt).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
              {!provider.isActive && (
                <Button
                  onClick={onApprove}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 font-bold active:scale-95 transition-all"
                >
                  Approve
                </Button>
              )}

              {!provider.isActive && (
                <Button
                  onClick={onReject}
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 rounded-full px-8 font-bold hover:bg-red-50 hover:text-red-600 border-none transition-all"
                >
                  Reject
                </Button>
              )}

              <Button
                variant="link"
                className="text-teal-600 font-bold ml-auto p-0 hover:no-underline hover:text-teal-700"
                onClick={() => setShowDetails((prev) => !prev)}
              >
                {showDetails ? "Hide Details" : "View Details"}
              </Button>
            </div>

            {showDetails && (
              <div className="mt-6 space-y-4">
                {hasDocuments ? (
                  documents.map((doc, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {doc.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {doc.verified ? "Đã xác thực" : "Chưa xác thực"}
                          </p>
                        </div>
                      </div>
                      {renderDocumentPreview(doc, index)}
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Không có tài liệu để hiển thị.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderApprovalCard;
