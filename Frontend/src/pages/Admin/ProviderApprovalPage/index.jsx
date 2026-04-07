import ProviderApprovalCard from "./ProviderApprovalCard";
import ProcessedProvidersList from "./ProcessedProvidersList";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockProviders = [
  {
    id: 1,
    name: "Skyline Alpine Expeditions",
    description:
      "Specializing in high-altitude trekking and luxury basecamp experiences across the Swiss Alps.",
    status: "new",
    logoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_SaGAk79jB4iPaIILNisKZHe3NoIeLNXN2ha1eR1tk7QFencsbo3JNDYx2j1Isdc2FMRxGw9u-SeYxwJR9FXARahUXVaXzbFwq6GSg71HiPR1I0YPcHz9BWrPwJuXLEHzKy-jxDa1wDz5z5LaXFbfrud-GJ_AXxUTMjb-Y5VKTJEBjfZ-hAH7HDJ8r_pjOxnP64KDyqSdbif_MteWMtdazuE1djydDaG8yVQQ88ZtbDUVSLvIWQ9yw2oPTAFydL4qfNa5IpD3N4Mj",
    documents: [
      { name: "Business_License.pdf", verified: true, icon: "description" },
      { name: "Insurance_Cert.pdf", verified: true, icon: "policy" },
      { name: "Tax_ID_Verification", verified: false, icon: "history_edu" },
    ],
  },
  {
    id: 2,
    name: "Oceanic Yacht Charters",
    description:
      "Premium Mediterranean yacht rentals with fully-staffed crews and bespoke coastal itineraries.",
    status: "urgent",
    logoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfqMHhXRIm_qAefyf2KTf66IKp9T5V6EGcfh_TixkeMLHJJLrH17OsVOwXdHKH7FejURnAnNRcd7kd6hmwGSNuzEjH0LUn63HtTUg9ZaJt3_onQCqoyD9IIqJX7TXI9mY6Oir_HIo9chyyjaCL3kU-a9SMmsuXS8Q0QSNYRFrvv_oFI4lRsfABkaM008Pw32SKM2lHBzPsunPkRW37gCZt6u_9jZgZO1NL6-LTF7IDUhW9FyAf-u3Vv-SklNKGCB1HMyEZe3V0nUej",
    documents: [
      { name: "Maritime_Ops.pdf", verified: true, icon: "description" },
      { name: "Safety_Audit_2024", verified: true, icon: "verified" },
    ],
  },
];

const mockProcessed = [
  {
    id: 1,
    name: "Desert Treks UAE",
    initials: "DT",
    date: "Oct 24, 2023",
    status: "approved",
    reviewer: "admin_martha",
  },
  {
    id: 2,
    name: "Berlin Bike Tours",
    initials: "BB",
    date: "Oct 23, 2023",
    status: "rejected",
    reviewer: "admin_james",
  },
];
const ProviderApprovalPage = () => {
  const providers = mockProviders || [];
  const processed = mockProcessed || [];

  return (
    <div className="pt-24 pb-12  max-w-[1600px] mx-auto space-y-12">
      <section>
        <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Review New Partnerships
        </h3>
        <p className="text-slate-500 mt-2 max-w-2xl text-sm">
          Examine business credentials and verification documents for providers
          requesting access to the marketplace.
        </p>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          {providers.map((p) => (
            <ProviderApprovalCard key={p.id} provider={p} />
          ))}
        </div>

        <div className="xl:col-span-4 space-y-6">
          <Card className="bg-teal-900 border-none text-white relative overflow-hidden rounded-3xl shadow-xl p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-[11px] font-bold tracking-[0.15em] uppercase opacity-60 relative z-10">
                Approval Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              <div>
                <p className="text-4xl font-extrabold font-headline">88%</p>
                <p className="text-sm opacity-70 mt-1">
                  Provider Approval Rate (MTD)
                </p>
                <Progress value={88} className="h-1.5 mt-4 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                  <p className="text-2xl font-bold font-headline">12</p>
                  <p className="text-[10px] opacity-50 font-bold uppercase mt-1">
                    New This Week
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                  <p className="text-2xl font-bold font-headline">4.2d</p>
                  <p className="text-[10px] opacity-50 font-bold uppercase mt-1">
                    Avg. Review Time
                  </p>
                </div>
              </div>
            </CardContent>

            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          </Card>

          <Card className="bg-white border-slate-200 rounded-3xl shadow-sm p-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Verification Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500 space-y-4 leading-relaxed pb-6">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-600 text-sm">
                  verified
                </span>
                <p>Verify business license validity for current year.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-600 text-sm">
                  security
                </span>
                <p>Ensure insurance coverage meets $5M minimum.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-600 text-sm">
                  database
                </span>
                <p>Validate Tax ID against official databases.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="pt-10 border-t border-slate-100">
        <h4 className="text-xl font-bold text-slate-900 mb-6 px-2">
          Processed Requests
        </h4>
        <ProcessedProvidersList data={processed} />
      </section>
    </div>
  );
};

export default ProviderApprovalPage;
