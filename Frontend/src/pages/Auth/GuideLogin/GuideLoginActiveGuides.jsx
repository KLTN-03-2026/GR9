import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

const GuideLoginActiveGuides = ({ avatars }) => {
  return (
    <div className="fixed right-8 top-8 hidden lg:block">
      <AvatarGroup className="-space-x-3">
        {avatars.map((avatar) => (
          <Avatar
            key={avatar.src}
            size="lg"
            className="ring-4 ring-surface-container-lowest after:border-transparent"
          >
            <AvatarImage alt={avatar.alt} src={avatar.src} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount className="size-10 bg-primary-fixed text-[10px] font-bold text-on-primary-fixed-variant ring-4 ring-surface-container-lowest">
          +12k
        </AvatarGroupCount>
      </AvatarGroup>
      <p className="mt-3 text-right text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
        Guides Active Now
      </p>
    </div>
  );
};

export default GuideLoginActiveGuides;
