interface LogoProps {
  onClick?: () => void;
}

export default function Logo({ onClick }: LogoProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-1.5 text-mesh"
    >
      <span
        className="w-[26px] h-[26px] rounded-lg bg-cobalt flex items-center justify-center font-display font-extrabold text-[15px] text-white"
        style={{ boxShadow: "0 4px 12px -4px rgba(47,67,206,0.8)" }}
      >
        s
      </span>
      <span className="font-mono text-[15px] tracking-[0.02em] font-medium">
        squeeze.to
      </span>
    </button>
  );
}
