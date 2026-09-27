import { useCallback, useEffect, useId, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  accept: string;
  label: string;
  hint?: string;
  icon: ReactNode;
  preview?: ReactNode;
  disabled?: boolean;
  compact?: boolean;
  onFile: (file: File) => void;
}

export function DropZone({
  accept,
  label,
  hint,
  icon,
  preview,
  disabled,
  compact,
  onFile,
}: DropZoneProps) {
  const id = useId();
  const [over, setOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const take = useCallback(
    (file: File | undefined) => {
      if (!file || disabled) return;
      onFile(file);
    },
    [disabled, onFile],
  );

  const onDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === "dragenter" || e.type === "dragover") setOver(true);
    if (e.type === "dragleave") setOver(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    take(e.dataTransfer.files?.[0]);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    take(e.target.files?.[0]);
    e.target.value = "";
  };

  return (
    <label
      htmlFor={mounted ? id : undefined}
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragLeave={onDrag}
      onDrop={onDrop}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed text-center transition-[border-color,background-color,box-shadow] duration-200",
        compact ? "min-h-40 gap-2 p-4" : "min-h-56 gap-3 p-8",
        over
          ? "border-accent bg-accent/10 shadow-[var(--shadow-border-hover)]"
          : "border-border-strong bg-surface hover:border-muted hover:bg-raised",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {mounted ? (
        <input
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={disabled}
          onChange={onChange}
        />
      ) : null}
      {preview ? (
        preview
      ) : (
        <>
          <span className="text-muted transition-colors duration-200 group-hover:text-fg">
            {icon}
          </span>
          <span className="text-sm font-medium text-fg">{label}</span>
          {hint ? <span className="text-xs text-muted">{hint}</span> : null}
        </>
      )}
    </label>
  );
}
