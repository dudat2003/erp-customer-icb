import React from "react";

interface Props {
  size?: number;
  fill?: string;
  width?: number;
  height?: number;
}

export function DownloadIcon({ fill, size, height, width, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={fill || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-monitor-down-icon lucide-monitor-down"
      {...props}
    >
      <path d="M12 13V7" />
      <path d="m15 10-3 3-3-3" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </svg>
  );
}
