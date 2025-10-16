"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

type Props = { value: string; arialLabel?: string };

export default function CopyButton({
  value,
  arialLabel = "Copy to clipboard",
}: Props) {
  const [ok, setOk] = useState(false);

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setOk(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setOk(false), 2000);
      }}
      aria-label={arialLabel}
    >
      {/* {ok ? "Copied!" : "Copy"} */}
      {ok ? (
        <div className="flex flex-row items-center gap-2">
          <Check /> Copied
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2">
          <Copy /> Copy
        </div>
      )}
    </Button>
  );
}
