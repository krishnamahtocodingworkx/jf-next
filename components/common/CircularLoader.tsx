"use client";

type CircularLoaderProps = {
  size?: number;
  className?: string;
};

export function CircularLoader({ size = 16, className = "" }: CircularLoaderProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`.trim()}
      style={{ width: size, height: size }}
    />
  );
}
