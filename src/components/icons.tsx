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
      <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
      <path d="m9.5 9.4 1.1.8c.9 1.2 2.2 2.8 2.4 4.8"/>
      <path d="M14.5 9.4c-1.1.8-1.8 2.2-1.5 3.6"/>
      <path d="M12 6c-3.5 0-6 2.5-6 6"/>
    </svg>
  );
}
