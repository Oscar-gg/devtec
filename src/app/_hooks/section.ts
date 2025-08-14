"use client";

import { usePathname } from "next/navigation";

export const useSection = () => {
  const pathname = usePathname();

  if (pathname === "/") {
    return { activeSection: "projects" };
  }
  const activeSection = pathname.split("/")[1];

  return {
    activeSection,
  };
};
