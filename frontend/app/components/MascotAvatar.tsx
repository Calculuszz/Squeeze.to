import Image from "next/image";

interface MascotAvatarProps {
  variant?: "smile" | "neutral";
  size?: number;
  className?: string;
}

export default function MascotAvatar({
  variant = "smile",
  size = 52,
  className = "",
}: MascotAvatarProps) {
  const src =
    variant === "smile"
      ? "/assets/mascot-smile.png"
      : "/assets/mascot-neutral.png";

  const borderRadius = size > 60 ? 24 : size > 40 ? 13 : 10;

  return (
    <div
      className={`flex-shrink-0 overflow-hidden bg-mascot-bg ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius,
      }}
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="w-full h-full object-cover"
        style={{ objectPosition: "50% 16%" }}
        priority
      />
    </div>
  );
}
