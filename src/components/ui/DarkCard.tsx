import type { HTMLAttributes, ReactNode } from "react";
import { Card } from "./Card";

type DarkCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function DarkCard({ children, className, ...props }: DarkCardProps) {
  return (
    <Card className={className} {...props}>
      {children}
    </Card>
  );
}
