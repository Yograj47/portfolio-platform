"use client";
import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open navigation menu"
        className="grid size-11 shrink-0 place-items-center rounded-md border hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Popup className="fixed inset-y-0 left-0 z-50 h-dvh w-72 max-w-[85vw] overflow-y-auto overscroll-contain bg-sidebar shadow-xl outline-none">
          <Dialog.Title className="sr-only">Admin navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Choose a management section.
          </Dialog.Description>
          <Dialog.Close
            aria-label="Close navigation menu"
            className="absolute right-2 top-2 z-10 grid size-11 place-items-center rounded-md hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </Dialog.Close>
          <DashboardSidebar
            className="static flex min-h-full h-auto w-full flex-col border-0"
            onNavigate={() => setOpen(false)}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
