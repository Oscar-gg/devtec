import type { SVGProps } from "react";

export const ForkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16" {...props}>
      <path
        fillRule="evenodd"
        d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-3 8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};
