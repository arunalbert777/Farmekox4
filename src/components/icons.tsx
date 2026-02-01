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
      <path d="M2 22v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" />
      <path d="M2 18h20" />
      <path d="M12 18V2" />
      <path d="M10 4l-2-2" />
      <path d="M14 4l2-2" />
      <path d="M6 8l-2-2" />
      <path d="M18 8l2-2" />
    </svg>
  );
}
