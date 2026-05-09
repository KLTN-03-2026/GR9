import { Camera, ImagePlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReviewGalleryCard({ uploadedCount, maxUpload, images }) {
  return (
    <Card className="border-outline-variant/10 bg-surface-container-lowest shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
      <CardHeader className="px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="brand-font text-xl font-bold">
              Trip Gallery
            </CardTitle>
            <CardDescription>
              Upload photos from your journey. Maximum {maxUpload} images.
            </CardDescription>
          </div>
          <Badge variant="outline" className="w-fit">
            {uploadedCount}/{maxUpload} uploaded
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 px-6 sm:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.src}
            className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/90 opacity-0 shadow-sm backdrop-blur group-hover:opacity-100"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="aspect-square h-auto flex-col gap-2 rounded-xl border-dashed bg-white text-on-surface-variant hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <ImagePlus className="h-7 w-7" />
          <span className="text-xs font-bold">Add Photo</span>
        </Button>
      </CardContent>
    </Card>
  );
}
