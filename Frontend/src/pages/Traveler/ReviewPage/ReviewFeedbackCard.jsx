import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewFeedbackCard({
  title,
  description,
  placeholder,
  value,
  onChange,
}) {
  return (
    <Card className="border-outline-variant/10 bg-surface-container-lowest shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
      <CardHeader className="px-6">
        <CardTitle className="brand-font text-xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <Textarea
          value={value}
          onChange={onChange}
          className="min-h-36 resize-none bg-white p-4"
          placeholder={placeholder}
        />
      </CardContent>
    </Card>
  );
}
