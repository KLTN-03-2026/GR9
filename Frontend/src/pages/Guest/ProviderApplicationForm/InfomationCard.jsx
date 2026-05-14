import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InfomationCard = ({ title, description, icon: Icon, children }) => {
  return (
    <Card className="overflow-hidden rounded-[30px] border border-[#e8ded0] bg-white/92 py-0 shadow-[0_24px_70px_rgba(38,33,28,0.08)] backdrop-blur-sm">
      <CardHeader className="border-b border-[#efe7dc] px-6 py-5 sm:px-7">
        <div className="flex items-start gap-4">
          {Icon ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#0b8c87]/10 text-[#0b8c87]">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <CardTitle className="[font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[1.7rem] leading-tight tracking-[-0.03em] text-[#1f2d2f]">
              {title}
            </CardTitle>
            {description ? (
              <p className="max-w-2xl text-sm leading-6 text-[#6f7069]">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 px-6 py-6 sm:px-7">
        {children}
      </CardContent>
    </Card>
  );
};

export default InfomationCard;
