import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewSuggestionCard({ text, actionText }) {
  return (
    <Card className="border-tertiary-container/40 bg-tertiary-container/20 shadow-[0px_20px_40px_rgba(25,28,30,0.04)]">
      <CardContent className="space-y-3 px-6">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            AI Suggestion
          </span>
        </div>
        <p className="text-sm font-medium leading-6 text-on-surface">{text}</p>
        <Button variant="link" className="h-auto px-0 font-bold">
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
}
