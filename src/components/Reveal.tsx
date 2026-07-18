import type { PropsWithChildren } from "react";
import { useReveal } from "../lib/useReveal";

export default function Reveal({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className={`fade-in-up ${className}`}>{children}</div>;
}
