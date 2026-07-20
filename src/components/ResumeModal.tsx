import { useEffect } from "react";

export default function ResumeModal({
  resumeUrl,
  open,
  onClose,
}: {
  resumeUrl: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Résumé preview"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-3xl h-[85vh] rounded-2xl border border-line bg-elevated shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-line shrink-0">
          <p className="font-mono text-xs uppercase tracking-wider text-mute">Résumé preview</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close résumé preview"
            className="w-8 h-8 flex items-center justify-center rounded-md text-soft hover:text-mint hover:bg-black/10 transition-colors"
          >
            ✕
          </button>
        </div>
        <iframe
          src={`${resumeUrl}#toolbar=0&navpanes=0`}
          title="Résumé preview"
          className="flex-1 w-full bg-white"
        />
      </div>
    </div>
  );
}
