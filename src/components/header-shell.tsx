"use client";

import dynamic from "next/dynamic";
import { HeaderShellStatic } from "@/components/header-shell-static";

const HeaderClient = dynamic(
  () => import("@/components/header-client").then((m) => m.HeaderClient),
  {
    ssr: false,
    loading: () => <HeaderShellStatic />,
  }
);

export function HeaderShell() {
  return <HeaderClient />;
}
