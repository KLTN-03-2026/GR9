import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

function PlannerItinerary({ itinerary, handleGetLatLng }) {
  if (!itinerary) {
    return null;
  }
  return (
    <div className="w-full min-w-0 space-y-8 rounded-[2rem] border border-outline-variant/15 bg-surface-container-lowest p-5 shadow-sm md:p-7">
      {itinerary.itineraries.map((itineraryActivity, index) => (
        <div
          key={`${itineraryActivity.description}-${index}`}
          className="relative border-l-2 border-dashed border-outline-variant/30 pl-6 md:pl-8"
        >
          <div className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-4 border-surface bg-primary text-[10px] font-bold text-on-primary">
            {index + 1}
          </div>

          <h3 className="mb-6 font-headline text-xl font-bold">
            Day {index + 1}: {itineraryActivity.description}
          </h3>
          <div className="space-y-6">
            {itineraryActivity.activities.map((activity) => (
              <Card
                onClick={() => handleGetLatLng(activity.serviceId.address)}
                key={`${activity.time}-${activity.serviceId.name}`}
                    className="cursor-pointer rounded-2xl border border-outline-variant/10 bg-surface-container-low py-0 shadow-none ring-0 transition-all hover:-translate-y-0.5 hover:bg-surface-container"
              >
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
                  <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24">
                    <img
                      alt="Shigetsu"
                      className="h-full w-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsPDoUz8nNjOAIU_nBr4ZnnXsHVXFAyALVzJ0i79bxTBsmTI3XGj1I6QuNl9-ylsCylPULawD2VoxAnBTiHh7E7YTwo8_hvWwHnDmpMjCHt2gh49NOJJDlBmIXhU5qgLrXolwJVepB7c5XOVfZjqlqN1YoJ_j2ZsqU-SFzxJ3HMR2cp2GiOCnXi49cDY12-tmotcFHAMgYuqGrfv-sh2IJ9-QP0HsbeGr2aXaO2iHP5_qQ-qnStT-wY_Pm0-Nr0HP1RU2gpuwB3vFA"
                    />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase text-tertiary">
                      {activity.time}
                    </div>
                    <CardTitle className="font-bold text-on-surface">
                      {activity.serviceId.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                      {activity.serviceId.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlannerItinerary;
