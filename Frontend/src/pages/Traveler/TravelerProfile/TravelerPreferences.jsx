import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const preferences = ["Beach", "Foodie", "Adventure", "Culture", "Nightlife"];

export default function TravelerPreferences() {
  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Travel Preferences</CardTitle>
        <CardDescription>
          Traveler signals used for AI recommendations and itinerary matching.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {preferences.map((preference) => (
          <Badge
            key={preference}
            className="bg-teal-50 px-3 py-1.5 text-teal-700"
          >
            {preference}
          </Badge>
        ))}
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Add Style
        </Button>
      </CardContent>
    </Card>
  );
}
