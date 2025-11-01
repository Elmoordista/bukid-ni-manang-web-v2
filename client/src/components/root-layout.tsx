import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import { useLocation } from "react-router-dom";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // If the current path is under /admin, enable adminMode on Navigation
  const adminMode = location.pathname.startsWith("/admin");

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/10">
        <div className="relative flex min-h-screen flex-col">
          {!adminMode && (
          <div className="sticky top-0 z-50">
            <Navigation adminMode={false} />
          </div>
        )}
          <main className="flex-1 relative">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}