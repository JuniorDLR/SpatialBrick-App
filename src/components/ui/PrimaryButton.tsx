import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function PrimaryButton({
  children,
  className,
  fullWidth = false,
  isLoading = false,
  type = "button",
  variant = "primary",
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      type={type}
      fullWidth={fullWidth}
      isLoading={isLoading}
      variant={variant}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}
