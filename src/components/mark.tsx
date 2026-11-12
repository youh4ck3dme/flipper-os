import { cn } from "@/lib/cn";

export function Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "glass inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-primary",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <path
          d="M4 14.5c0-3.6 2.6-6 6.2-6 1.2 0 2.2.3 3.1.8.4-1.6 1.6-2.8 3.4-2.8 1.5 0 2.6.9 2.8 2.3.8.3 1.5 1.1 1.5 2.2 0 1.4-1.2 2.4-2.7 2.4h-1.2c.5.8.8 1.7.8 2.7 0 3.2-2.8 5.4-6.4 5.4S4 19.3 4 16.2v-1.7Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
