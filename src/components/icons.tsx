// Interface icons. Directional icons flip in right-to-left (rtl:-scale-x-100);
// pictograms and medicine symbols never flip, so they don't live here.

type IconProps = { size?: number; className?: string };

export function BackArrow({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={`rtl:-scale-x-100 ${className}`}>
      <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Chevron({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={`rtl:-scale-x-100 ${className}`}>
      <path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Not directional: a tick reads the same both ways. */
export function Check({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CameraIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M4 8h3l2-3h6l2 3h3v11H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ImageIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m4 16 5-5 4 4 2-2 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
