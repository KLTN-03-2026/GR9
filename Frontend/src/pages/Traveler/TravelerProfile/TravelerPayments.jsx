import { CreditCard, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const methods = [
  { brand: "Visa Signature", last4: "4242", expires: "12/26", isDefault: true },
  { brand: "Mastercard", last4: "8812", expires: "08/25", isDefault: false },
];

export default function TravelerPayments() {
  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Saved Payment Methods</CardTitle>
        <CardDescription>Cards available for future bookings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {methods.map((method) => (
          <div
            key={method.last4}
            className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-slate-50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-950">
                  {method.brand} **** {method.last4}
                </p>
                <p className="text-xs text-slate-500">Expires {method.expires}</p>
              </div>
            </div>
            {method.isDefault ? (
              <Badge variant="secondary">DEFAULT</Badge>
            ) : (
              <Button variant="link" className="px-0 text-teal-700">
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline">
          <Plus className="h-4 w-4" />
          Add New Payment Method
        </Button>
      </CardContent>
    </Card>
  );
}
