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
      <path d="M12 22c-5 0-9-4.5-9-9.5S4.5 3 9.5 3c2.2 0 4.2 1 5.5 2.5" />
      <path d="M12 22c5 0 9-4.5 9-9.5s-4.5-9.5-9.5-9.5" />
      <path d="M7 10s1.5 2 5 2 5-2 5-2" />
      <path d="M10.5 14c-1.5.5-3 0-3-1.5s1.5-2 3-1.5" />
    </svg>
  );
}
