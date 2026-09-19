import { useState } from "react";
import bundled from "@/assets/avatar.png";
import { avatarUrl } from "@/lib/site";

interface AvatarProps {
  /** The CSS size it is drawn at. A 2x source is requested alongside it for dense screens. */
  size: number;
  /** Empty where the surrounding copy already names whose avatar it is. */
  alt: string;
  className?: string;
}

/**
 * The GitHub profile picture, fetched from GitHub rather than bundled, so changing it there
 * changes it here without a rebuild. GitHub serves avatars with `max-age=300`, so a new one
 * shows up within five minutes.
 *
 * `src/assets/avatar.png` stays in the repo as the fallback for when that request fails:
 * offline, GitHub down, or a network that blocks it. It is a separate file in `dist` and is
 * only fetched if the linked one errors.
 */
export default function Avatar({ size, alt, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <img className={className} src={bundled} alt={alt} width={size} height={size} />;
  }

  return (
    <img
      className={className}
      src={avatarUrl(size)}
      srcSet={`${avatarUrl(size)} 1x, ${avatarUrl(size * 2)} 2x`}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}
