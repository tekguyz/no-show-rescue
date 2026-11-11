import type { Metadata } from "next";
import { business } from "@/lib/demo/business";

// Every demo screen is kept out of search (DEMO-STANDARD.md, Search engines).
// The demo is client-rendered: everything lives in the visitor's own browser
// (ADR 0001).
export const metadata: Metadata = {
  title: { default: `Demo: ${business.name}`, template: "%s · No-Show Rescue" },
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: LayoutProps<"/demo">) {
  return children;
}
