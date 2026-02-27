import { memo } from "react";

function Card({ className = "", children }) {
  // shared card wrapper
  return (
    <div
      className={[
        "rounded-2xl border transition",
        "bg-(--card-bg) border-(--card-border) shadow-(--card-shadow)",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default memo(Card);