import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

interface ToasterProviderProps {
  children: ReactNode;
}

export function ToasterProvider({ children }: ToasterProviderProps): JSX.Element {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}