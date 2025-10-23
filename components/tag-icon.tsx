import React from 'react'

interface TagIconProps {
  className?: string
}

export default function TagIcon({ className = "h-10 w-10" }: TagIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tag body - rounded rectangle */}
      <rect
        x="4"
        y="8"
        width="16"
        height="12"
        rx="2"
        ry="2"
        fill="currentColor"
      />
      {/* Tag top - triangular/pointed top */}
      <path
        d="M12 4L16 8H8L12 4Z"
        fill="currentColor"
      />
      {/* Hole in the tag - white circle */}
      <circle
        cx="12"
        cy="14"
        r="2"
        fill="white"
      />
    </svg>
  )
}
