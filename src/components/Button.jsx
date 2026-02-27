import { memo } from "react";

function Button({ className = "", ...props }) {
  // primary button
  return (
    <button
      {...props}
      className={[
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold",
        "text-white active:translate-y-px disabled:opacity-60 transition",
        "bg-(--brand-blue-dark) hover:bg-(--brand-blue-dark-hover)",
        className,
      ].join(" ")}
    />
  );
}

export default memo(Button);