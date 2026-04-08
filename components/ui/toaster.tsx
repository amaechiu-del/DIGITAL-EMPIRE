"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-white border border-slate-200 shadow-md text-slate-900",
          description: "text-slate-500",
          actionButton: "bg-brand text-white",
          cancelButton: "bg-slate-100 text-slate-900",
        },
      }}
    />
  );
}
