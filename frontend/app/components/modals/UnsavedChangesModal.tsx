"use client";

interface UnsavedChangesModalProps {
  open: boolean;
  title: string;
  message: string;
  primaryActionText: string;
  secondaryActionText: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  onClose: () => void;
}

export default function UnsavedChangesModal({
  open,
  title,
  message,
  primaryActionText,
  secondaryActionText,
  onPrimaryAction,
  onSecondaryAction,
  onClose,
}: UnsavedChangesModalProps) {
  if (!open) return null;

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/60
      flex
      items-center
      justify-center
      z-50
      px-4
      "
    >
      <div
        className="
        w-full
        max-w-lg
        bg-zinc-900
        border
        border-zinc-700
        rounded-xl
        shadow-2xl
        "
      >
        <div className="p-6">
          <h2 className="text-white text-xl font-bold mb-3">
            {title}
          </h2>

          <p className="text-zinc-300 text-sm leading-6">
            {message}
          </p>
        </div>

        <div
          className="
          border-t
          border-zinc-700
          px-6
          py-4
          flex
          flex-col
          sm:flex-row
          gap-3
          sm:justify-end
          "
        >
          <button
            type="button"
            onClick={onPrimaryAction}
            className="
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            px-4
            py-2
            rounded
            "
          >
            {primaryActionText}
          </button>

          <button
            type="button"
            onClick={onSecondaryAction}
            className="
            bg-orange-600
            hover:bg-orange-700
            text-white
            px-4
            py-2
            rounded
            "
          >
            {secondaryActionText}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
            bg-zinc-700
            hover:bg-zinc-600
            text-white
            px-4
            py-2
            rounded
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}