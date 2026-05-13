import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Mail,
  MapPin,
  Phone,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyProvider, getActiveProviderPolicy } from "@/services/api/provider";
import InfomationCard from "./InfomationCard";
import SubmissionWaiting from "./SubmissionWaiting";
import UploadFile from "./UploadFile";
import { useI18n } from "@/i18n/I18nProvider";

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const PHONE_PATTERN = /^(0|\+84)(\d[\s.-]?){8,10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ProviderApplicationForm = () => {
  const { t } = useI18n();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "OTHER",
    address: "",
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [providerPolicy, setProviderPolicy] = useState(null);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        const response = await getActiveProviderPolicy();
        setProviderPolicy(response?.data?.data || null);
      } catch {
        setProviderPolicy(null);
      }
    };

    loadPolicy();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = () => {
    if (form.fullName.trim().length < 3) return t("providerApplication.validationName");
    if (!form.email.trim()) return t("providerApplication.validationEmailRequired");
    if (!EMAIL_PATTERN.test(form.email.trim())) return t("providerApplication.validationEmailInvalid");
    if (!form.phone.trim()) return t("providerApplication.validationPhoneRequired");
    if (!PHONE_PATTERN.test(form.phone.trim())) return t("providerApplication.validationPhoneInvalid");
    if (form.address.trim().length < 6) return t("providerApplication.validationAddress");
    if (!providerPolicy?._id) return t("providerApplication.validationPolicyMissing");
    if (!acceptedPolicy) return t("providerApplication.validationPolicyRequired");
    if (!documentFile) return t("providerApplication.validationDocumentRequired");
    if (documentFile.type !== "application/pdf") return t("providerApplication.validationDocumentType");
    if (documentFile.size > MAX_DOCUMENT_SIZE) return t("providerApplication.validationDocumentSize");
    return "";
  };

  const handleSubmit = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("acceptedProviderPolicyId", providerPolicy._id);
      formData.append("providerDocument", documentFile);

      await applyProvider(formData);
      toast.success(t("providerApplication.submitSuccess"));
      setSubmitted(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || t("providerApplication.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <SubmissionWaiting />;
  }

  return (
    <main className="min-h-screen bg-surface px-5 py-10 text-on-surface md:px-10">
      <div className="mx-auto max-w-6xl">
        <Button asChild variant="ghost" className="mb-6 rounded-full">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("guestHeader.backHome")}
          </Link>
        </Button>

        <header className="mb-10 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">
              {t("providerApplication.eyebrow")}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-normal md:text-5xl">
              {t("providerApplication.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-variant">
              {t("providerApplication.description")}
            </p>
          </div>

          <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-[0_18px_45px_rgba(25,28,30,0.06)] ring-1 ring-outline-variant/10">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-bold">{t("providerApplication.approvedTitle")}</p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  {t("providerApplication.approvedDescription")}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <InfomationCard title={t("providerApplication.basicInfo")} icon={Building2}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("providerApplication.legalName")}</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    placeholder="SmartTravel Company"
                    className="h-12 border-none bg-slate-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("providerApplication.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      type="email"
                      placeholder="contact@travel.com"
                      className="h-12 border-none bg-slate-50 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("providerApplication.phone")}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      type="tel"
                      placeholder="+84..."
                      className="h-12 border-none bg-slate-50 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">{t("providerApplication.representativeGender")}</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger className="h-12 border-none bg-slate-50">
                      <SelectValue placeholder={t("providerApplication.chooseGender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">{t("providerApplication.male")}</SelectItem>
                      <SelectItem value="FEMALE">{t("providerApplication.female")}</SelectItem>
                      <SelectItem value="OTHER">{t("providerApplication.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </InfomationCard>

            <InfomationCard title={t("providerApplication.addressSection")} icon={Briefcase}>
              <div className="space-y-2">
                <Label htmlFor="address">{t("providerApplication.address")}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <Input
                    id="address"
                    value={form.address}
                    onChange={handleChange("address")}
                    className="h-12 border-none bg-slate-50 pl-10"
                    placeholder={t("providerApplication.addressPlaceholder")}
                  />
                </div>
              </div>
            </InfomationCard>

            <InfomationCard title={t("providerApplication.documentSection")} icon={UploadCloud}>
              <div className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-700">
                        {t("providerApplication.policyTitle")}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {t("providerApplication.policyDescription")}
                      </p>
                    </div>
                  </div>
                </div>

                {providerPolicy ? (
                  <div className="space-y-4 p-5">
                    <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">{providerPolicy.title}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {t("providerApplication.policyFileNote")}
                        </p>
                      </div>
                      <a
                        href={providerPolicy.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-teal-700"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("providerApplication.openPolicy")}
                      </a>
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-100/70">
                      <Checkbox
                        checked={acceptedPolicy}
                        onCheckedChange={(checked) => setAcceptedPolicy(Boolean(checked))}
                        className="mt-0.5"
                      />
                      <span className="leading-6">
                        {t("providerApplication.acceptPolicy")}
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="p-5">
                    <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                      {t("providerApplication.noPolicy")}
                    </p>
                  </div>
                )}
              </div>
              <UploadFile file={documentFile} onFileChange={setDocumentFile} />
            </InfomationCard>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-[0_22px_55px_rgba(15,23,42,0.20)]">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold">{t("providerApplication.checklistTitle")}</h3>
                  <div className="mt-5 space-y-3 text-sm text-slate-200">
                    <p>{t("providerApplication.checklistEmail")}</p>
                    <p>{t("providerApplication.checklistDocument")}</p>
                    <p>{t("providerApplication.checklistCloudinary")}</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/25 blur-3xl" />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-14 w-full rounded-2xl bg-primary text-base font-bold text-on-primary shadow-xl shadow-primary/20 hover:bg-teal-700"
              >
                {isSubmitting ? t("providerApplication.submitting") : t("providerApplication.submit")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProviderApplicationForm;
