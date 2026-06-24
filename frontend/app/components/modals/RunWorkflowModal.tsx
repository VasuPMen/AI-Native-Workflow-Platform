"use client";

interface RunWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  result: any;
}

export default function RunWorkflowModal({
  open,
  onClose,
  result,
}: RunWorkflowModalProps) {
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
        w-[700px]
        max-w-[90vw]
        rounded-xl
        shadow-2xl
        border
        border-zinc-700
        overflow-hidden
        "
      >
        <div
          className="
          flex
          items-center
          justify-between
          px-5
          py-4
          border-b
          border-zinc-700
          "
        >
          <h2 className="text-white text-lg font-semibold">
            Workflow Result
          </h2>

          <button
            onClick={onClose}
            className="
            text-zinc-400
            hover:text-white
            text-sm
            "
          >
            Close
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-zinc-400 text-sm mb-1">
              Status
            </p>

            <div className="text-emerald-400 font-medium">
              {result?.status || "No status"}
            </div>
          </div>

          <div>
            <p className="text-zinc-400 text-sm mb-1">
              Workflow ID
            </p>

            <div className="text-white">
              {result?.workflow_id ?? "-"}
            </div>
          </div>

          <div>
            <p className="text-zinc-400 text-sm mb-2">
              Final Output
            </p>

            <div
              className="
              bg-zinc-950
              border
              border-zinc-700
              rounded-lg
              p-4
              text-zinc-200
              whitespace-pre-wrap
              max-h-[400px]
              overflow-y-auto
              "
            >
              {result?.final_output ||
                "No output returned"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}