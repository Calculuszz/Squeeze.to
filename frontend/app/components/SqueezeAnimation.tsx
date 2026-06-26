import MascotAvatar from "./MascotAvatar";

interface SqueezeAnimationProps {
  longUrl: string;
  shortCode: string;
}

export default function SqueezeAnimation({
  longUrl,
}: SqueezeAnimationProps) {
  return (
    <div className="w-full h-[64px] flex items-center justify-center overflow-hidden">
      <div
        className="font-mono text-[15px] whitespace-nowrap origin-center"
        style={{ 
          color: "#8A8077",
          animation: "squeezeFast 0.5s cubic-bezier(0.72, 0, 0.24, 1) forwards"
        }}
      >
        {longUrl}
      </div>
    </div>
  );
}
