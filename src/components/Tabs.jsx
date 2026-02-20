import Badge from "./Badge";

export default function Tabs({
  allCount = 0,
  completedCount = 0,
  value = "all",
  onChange,
}) {
  // tabs switcher 
  const tabClass = (val) =>
    [
      "text-sm font-semibold transition",
      value === val ? "" : "text-[var(--muted)] hover:text-[var(--page-fg)]",
    ].join(" ");

  const badgeTone = (val, toneWhenActive) =>
    value === val ? toneWhenActive : "neutral";

  return (
    <div className="mt-6 flex items-center justify-between">
      {/* Belum Selesai */}
      <button
        type="button"
        onClick={() => onChange("all")}
        className={tabClass("all")}
        style={value === "all" ? { color: "var(--brand-blue)" } : undefined}
      >
        Belum Selesai
      </button>

      {/* Selesai */}
      <button
        type="button"
        onClick={() => onChange("completed")}
        className={tabClass("completed")}
        style={
          value === "completed" ? { color: "var(--brand-purple)" } : undefined
        }
      >
        Selesai{" "}
        <span className="ml-2 inline-flex align-middle">
          <Badge tone={badgeTone("completed", "purple")}>
            {`${completedCount} de ${allCount}`}
          </Badge>
        </span>
      </button>
    </div>
  );
}
