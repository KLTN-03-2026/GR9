import { useEffect } from "react";
import TourEditorContent from "./TourEditorContent";

export default function EditTour() {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") ?? "";

    document.title = "Edit Tour | SmartTravel Provider";

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      "Create and optimize provider tours in SmartTravel with itinerary planning, logistics setup, pricing, and traveler-ready experience details.",
    );

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface text-on-surface">
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 md:px-10 md:pt-24">
        <TourEditorContent />
      </div>
    </main>
  );
}
