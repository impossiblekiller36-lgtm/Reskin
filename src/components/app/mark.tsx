export function ReskinMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="10" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
      <rect x="8" y="7" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <rect x="14" y="4" width="14" height="14" rx="3.2" fill="currentColor" />
    </svg>
  );
}
