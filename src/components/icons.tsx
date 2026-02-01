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
      <path d="M17 8C8 10 5.5 17.5 9.5 21.5c0 0-2.5-3.5-1-5C10 14.5 17 12 17 8z" />
      <path d="M12 2c-3.14 0-6.14 1-8 3.5C2 7.5 2 12 5.5 15c0 0 2-2.5 5.5-3.5" />
    </svg>
  );
}
