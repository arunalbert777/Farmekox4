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
      <path d="M12 22c-5 0-9-4.5-9-9.5S3 3 12 3s9 4.5 9 9.5c0 1.68-.43 3.25-1.18 4.63" />
      <path d="M12 3a9.5 9.5 0 0 0-9.5 9.5c0 2.22.77 4.24 2.06 5.88" />
      <path d="M12 3a9.5 9.5 0 0 1 9.5 9.5c0 .24-.01.48-.04.71" />
      <path d="M7.5 14.5c.64.64 1.48 1.15 2.44 1.52" />
      <path d="m13 13.1-.91.91" />
      <path d="M15.5 15.5c.37-.96.56-1.98.56-3 0-2.22-.77-4.24-2.06-5.88" />
    </svg>
  );
}
