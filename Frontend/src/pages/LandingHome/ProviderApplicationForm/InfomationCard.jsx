import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const InfomationCard = ({ title, description, icon: Icon, children }) => {
  return (
    <Card className="border-none shadow-[0px_20px_40px_rgba(25,28,30,0.06)] bg-white">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        {Icon && <Icon className="text-primary w-6 h-6" />}
        <div>
          <CardTitle className="text-2xl font-headline font-bold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default InfomationCard;