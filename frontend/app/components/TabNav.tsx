interface TabNavProps {
  active: "home" | "stats";
  onChange: (view: "home" | "stats") => void;
}

export default function TabNav({ active, onChange }: TabNavProps) {
  const tabClass = (isActive: boolean) =>
    [
      "border-none cursor-pointer font-body text-[13.5px] font-semibold py-[7px] px-4 rounded-[9px] transition-all duration-200",
      isActive
        ? "bg-cobalt text-white shadow-[0_6px_16px_-8px_rgba(47,67,206,0.9)]"
        : "bg-transparent text-dim hover:text-mesh",
    ].join(" ");

  return (
    <nav
      className="flex gap-1.5 bg-input-bg p-[5px] rounded-xl"
      style={{ boxShadow: "inset 0 0 0 1px rgba(237,232,223,0.07)" }}
    >
      <button className={tabClass(active === "home")} onClick={() => onChange("home")}>
        Shorten
      </button>
      <button className={tabClass(active === "stats")} onClick={() => onChange("stats")}>
        Stats
      </button>
    </nav>
  );
}
