"use client";

interface Props {
  open: boolean;
  onClose: () => void;
  json: string;
}

export default function JsonPreviewModal({
  open,
  onClose,
  json,
}: Props) {
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
      "
    >
      <div
        className="
        bg-zinc-900
        text-white
        w-[800px]
        max-w-[90vw]
        h-[600px]
        rounded
        p-4
        flex
        flex-col
        "
      >
        <div
          className="
          flex
          justify-between
          mb-4
          "
        >
          <h2 className="text-xl font-bold">
            Workflow JSON
          </h2>

          <button
            onClick={onClose}
            className="
            bg-red-500
            px-3
            py-1
            rounded
            "
          >
            Close
          </button>
        </div>

        <pre
          className="
          flex-1
          overflow-auto
          bg-black
          p-4
          rounded
          text-sm
          "
        >
          {json}
        </pre>
      </div>
    </div>
  );
}