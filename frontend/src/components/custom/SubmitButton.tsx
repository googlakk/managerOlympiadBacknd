"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

function Loader({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <p>{text}</p>
    </div>
  );
}

interface SubmitButtonProps {
  text: string;
  loadingText: string;
  className?: string;
  loading?: boolean;
  handleFunction?: () => void
}

export function SubmitButton({
  text,
  loadingText,
  loading,
  className,
  handleFunction
}: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <Button
      type="submit"
      aria-disabled={status.pending || loading}
      disabled={status.pending || loading}
      className={cn(className)}
      onClick={handleFunction}
    >
      {status.pending || loading ? <Loader text={loadingText} /> : text}
    </Button>
  );
}