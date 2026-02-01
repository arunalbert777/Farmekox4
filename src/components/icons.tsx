import type { SVGProps } from "react";

export function FarmekoLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c-2 0-3-1-3-3s1-3 3-3c2 0 3 1 3 3s-1 3-3 3z" />
      <path d="M14.5 16.5A4.5 4.5 0 1 0 10 12a4.5 4.5 0 0 0 4.5 4.5z" />
      <path d="M18 12a6 6 0 1 0-6 6 6 6 0 0 0 6-6z" />
      <path d="M22 6c-2 0-3-1-3-3s1-3 3-3" />
      <path d="M19.5 7.5a4.5 4.5 0 1 0-4.5-4.5 4.5 4.5 0 0 0 4.5 4.5z" />
    </svg>
  );
}
