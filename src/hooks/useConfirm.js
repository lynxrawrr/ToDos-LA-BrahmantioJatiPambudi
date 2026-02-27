import { useState } from "react";

export function useConfirm() {
  // state: controls confirm dialog + promise resolver
  const [state, setState] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    tone: "danger",
    confirmIcon: null,
    resolve: null,
  });

  // action: open dialog and return a promise
  const confirm = (opts = {}) =>
    new Promise((resolve) => {
      setState({
        open: true,
        title: opts.title ?? "Are you sure?",
        message: opts.message ?? "",
        confirmText: opts.confirmText ?? "Confirm",
        cancelText: opts.cancelText ?? "Cancel",
        tone: opts.tone ?? "danger",
        confirmIcon: opts.confirmIcon ?? null,
        resolve,
      });
    });

  // handler: user clicked confirm
  const handleConfirm = () => {
    state.resolve?.(true);
    setState((s) => ({ ...s, open: false, resolve: null }));
  };

  // handler: user cancelled / closed dialog
  const handleCancel = () => {
    state.resolve?.(false);
    setState((s) => ({ ...s, open: false, resolve: null }));
  };

  return { confirm, dialogProps: state, handleConfirm, handleCancel };
}
