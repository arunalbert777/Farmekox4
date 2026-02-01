import type { SVGProps } from "react";

export function Sprout(props: SVGProps<SVGSVGElement>) {
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
        <path d="M2 22h20"/>
        <path d="M12 2a5 5 0 0 0-5 5v1.5c0 2.4-1.3 4.6-3.4 5.9"/>
        <path d="M12 2a5 5 0 0 1 5 5v1.5c0 2.4 1.3 4.6 3.4 5.9"/>
        <path d="M12 22V8"/>
    </svg>
  );
}
