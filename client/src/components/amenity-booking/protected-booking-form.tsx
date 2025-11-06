import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

interface ProtectedBookingFormProps {
  children: React.ReactNode;
}

export default function ProtectedBookingForm({ children }: ProtectedBookingFormProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5" />
            Login Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Please log in to book amenities at Bukid ni Manang.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="default" 
              onClick={() => navigate("/login", { state: { from: window.location.pathname } })}
            >
              Log In
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}