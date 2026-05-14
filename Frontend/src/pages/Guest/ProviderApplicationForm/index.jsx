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

import bayHero from "@/assets/redesign/bay-hero.png";
import BrandLogo from "@/components/shared/brand-logo";
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
import { useI18n } from "@/i18n/I18nProvider";
import { applyProvider, getActiveProviderPolicy } from "@/services/api/provider";

import InfomationCard from "./InfomationCard";
import SubmissionWaiting from "./SubmissionWaiting";
import UploadFile from "./UploadFile";

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const PHONE_PATTERN = /^(0|\+84)(\d[\s.-]?){8,10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const fieldClassName =
  "h-13 rounded-[18px] border border-[#e6dac9] bg-[#fcfaf6] px-4 text-[#213033] placeholder:text-[#8a857d] shadow-none focus-visible:border-[#0b8c87] focus-visible:ring-[#0b8c87]/10";

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
    if (form.fullName.trim().length < 3) {
      return t("providerApplication.validationName");
    }
    if (!form.email.trim()) {
      return t("providerApplication.validationEmailRequired");
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      return t("providerApplication.validationEmailInvalid");
    }
    if (!form.phone.trim()) {
      return t("providerApplication.validationPhoneRequired");
    }
    if (!PHONE_PATTERN.test(form.phone.trim())) {
      return t("providerApplication.validationPhoneInvalid");
    }
    if (form.address.trim().length < 6) {
      return t("providerApplication.validationAddress");
    }
    if (!providerPolicy?._id) {
      return t("providerApplication.validationPolicyMissing");
    }
    if (!acceptedPolicy) {
      return t("providerApplication.validationPolicyRequired");
    }
    if (!documentFile) {
      return t("providerApplication.validationDocumentRequired");
    }
    if (documentFile.type !== "application/pdf") {
      return t("providerApplication.validationDocumentType");
    }
    if (documentFile.size > MAX_DOCUMENT_SIZE) {
      return t("providerApplication.validationDocumentSize");
    }

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
      toast.error(
        error?.response?.data?.message || t("providerApplication.submitError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <SubmissionWaiting />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f1e7] text-[#213033]">
      <div className="absolute inset-x-0 top-0 h-[28rem] overflow-hidden">
        <img
          src={bayHero}
          alt=""
          className="h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,241,231,0.08)_0%,rgba(246,241,231,0.55)_42%,#f6f1e7_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(246,210,165,0.42),transparent_26%),radial-gradient(circle_at_top_right,rgba(11,140,135,0.18),transparent_22%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            asChild
            variant="ghost"
            className="rounded-full border border-[#ddd0bf] bg-white/55 px-4 text-[#324347] hover:bg-white/80"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("guestHeader.backHome")}
            </Link>
          </Button>

          <BrandLogo
            variant="editorial"
            className="gap-3"
            iconClassName="size-10"
            showTagline
            subLabel="Vietnam"
          />
        </div>

        <header className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="space-y-5">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#9f7d52]">
              {t("providerApplication.eyebrow")}
            </p>
            <h1 className="max-w-4xl [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.8rem] leading-[0.97] tracking-[-0.04em] text-[#1f2d2f] md:text-[4.6rem]">
              {t("providerApplication.title")}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#5c605d] md:text-[1.04rem]">
              {t("providerApplication.description")}
            </p>
          </div>

          <div className="rounded-[28px] border border-[#e8ded0] bg-white/78 p-5 shadow-[0_24px_70px_rgba(38,33,28,0.08)] backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#0b8c87]/10 text-[#0b8c87]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-[#233236]">
                  {t("providerApplication.approvedTitle")}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#6f7069]">
                  {t("providerApplication.approvedDescription")}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <InfomationCard
              title={t("providerApplication.basicInfo")}
              icon={Building2}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2.5">
                  <Label htmlFor="fullName" className="text-sm font-semibold text-[#3b4a4d]">
                    {t("providerApplication.legalName")}
                  </Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    placeholder="SmartTravel Company"
                    className={fieldClassName}
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-sm font-semibold text-[#3b4a4d]">
                    {t("providerApplication.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8b84]" />
                    <Input
                      id="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      type="email"
                      placeholder="contact@travel.com"
                      className={`${fieldClassName} pl-11`}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="phone" className="text-sm font-semibold text-[#3b4a4d]">
                    {t("providerApplication.phone")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8b84]" />
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      type="tel"
                      placeholder="+84..."
                      className={`${fieldClassName} pl-11`}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="gender" className="text-sm font-semibold text-[#3b4a4d]">
                    {t("providerApplication.representativeGender")}
                  </Label>
                  <Select
                    value={form.gender}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger className={fieldClassName}>
                      <SelectValue
                        placeholder={t("providerApplication.chooseGender")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">
                        {t("providerApplication.male")}
                      </SelectItem>
                      <SelectItem value="FEMALE">
                        {t("providerApplication.female")}
                      </SelectItem>
                      <SelectItem value="OTHER">
                        {t("providerApplication.other")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </InfomationCard>

            <InfomationCard
              title={t("providerApplication.addressSection")}
              icon={Briefcase}
            >
              <div className="space-y-2.5">
                <Label htmlFor="address" className="text-sm font-semibold text-[#3b4a4d]">
                  {t("providerApplication.address")}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8b84]" />
                  <Input
                    id="address"
                    value={form.address}
                    onChange={handleChange("address")}
                    className={`${fieldClassName} pl-11`}
                    placeholder={t("providerApplication.addressPlaceholder")}
                  />
                </div>
              </div>
            </InfomationCard>

            <InfomationCard
              title={t("providerApplication.documentSection")}
              icon={UploadCloud}
            >
              <div className="overflow-hidden rounded-[24px] border border-[#ebdfcf] bg-white shadow-sm">
                <div className="border-b border-[#f0e6d9] bg-[#fbf7f0] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#0b8c87]/10 text-[#0b8c87]">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9f7d52]">
                        {t("providerApplication.policyTitle")}
                      </p>
                      <p className="mt-1 text-sm text-[#6f7069]">
                        {t("providerApplication.policyDescription")}
                      </p>
                    </div>
                  </div>
                </div>

                {providerPolicy ? (
                  <div className="space-y-4 p-5">
                    <div className="flex flex-col gap-4 rounded-[22px] border border-[#efe5d8] bg-[#fbf8f2] p-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#243437]">
                          {providerPolicy.title}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8b857c]">
                          {t("providerApplication.policyFileNote")}
                        </p>
                      </div>

                      <a
                        href={providerPolicy.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#0b8c87] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#09726e]"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("providerApplication.openPolicy")}
                      </a>
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-[#e6dccd] bg-[#fcfaf5] p-4 text-sm font-semibold text-[#4a5658] transition hover:border-[#d8c7b2] hover:bg-[#f7f4ed]">
                      <Checkbox
                        checked={acceptedPolicy}
                        onCheckedChange={(checked) =>
                          setAcceptedPolicy(Boolean(checked))
                        }
                        className="mt-0.5"
                      />
                      <span className="leading-6">
                        {t("providerApplication.acceptPolicy")}
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="p-5">
                    <p className="rounded-[20px] bg-amber-50 p-4 text-sm font-semibold text-amber-700">
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
              <div className="relative overflow-hidden rounded-[30px] bg-[#112225] p-6 text-white shadow-[0_24px_70px_rgba(17,34,37,0.22)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(246,210,165,0.18),transparent_28%)]" />
                <div className="relative z-10">
                  <h3 className="[font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[1.8rem] leading-tight tracking-[-0.03em] text-[#f7ead8]">
                    {t("providerApplication.checklistTitle")}
                  </h3>
                  <div className="mt-5 space-y-3 text-sm leading-6 text-white/72">
                    <p>{t("providerApplication.checklistEmail")}</p>
                    <p>{t("providerApplication.checklistDocument")}</p>
                    <p>{t("providerApplication.checklistCloudinary")}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-14 w-full rounded-full bg-[#0b8c87] text-base font-bold text-white shadow-[0_16px_32px_rgba(11,140,135,0.2)] hover:bg-[#09726e]"
              >
                {isSubmitting
                  ? t("providerApplication.submitting")
                  : t("providerApplication.submit")}
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
