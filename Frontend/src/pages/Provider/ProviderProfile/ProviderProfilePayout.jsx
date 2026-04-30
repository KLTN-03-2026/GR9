import { Building, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const payout = {
  bankName: "Vietcombank (Priority Business)",
  maskedAccount: "**** **** 8271",
  nextPayout: "Sept 28, 2024",
};

export default function ProviderProfilePayout() {
  return (
    <Card className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest py-0 shadow-[0_18px_40px_rgba(25,28,30,0.04)]">
      <CardContent className="p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <WalletCards className="size-5" />
            </div>
            <h2 className="font-headline text-2xl font-bold">
              Payout Settings
            </h2>
          </div>

          <Button variant="link" className="h-auto px-0 text-sm font-bold text-primary">
            Manage Accounts
          </Button>
        </div>

        <div className="flex flex-col gap-5 rounded-[1.5rem] border border-primary/5 bg-secondary-container/30 p-6 md:flex-row md:items-center">
          <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
            <Building className="size-5 text-slate-800" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold text-on-secondary-container">
              {payout.bankName}
            </p>
            <p className="text-lg font-mono tracking-[0.2em] text-on-surface">
              {payout.maskedAccount}
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs text-on-surface-variant">Next Payout</p>
            <p className="text-sm font-bold">{payout.nextPayout}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
