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
      <path d="M7 20h10"/>
      <path d="M10 20c5.5-16 0-16-5.5-16"/>
      <path d="M14 20c-5.5-16 0-16 5.5-16"/>
    </svg>
  );
}
