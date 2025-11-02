import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Leaf, LogIn, Eye, EyeOff } from "lucide-react";
import HttpClient from "@/lib/axiosInstance.ts";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || undefined;
  const auth = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
     const response = await HttpClient.post('/auth/login',data); 
      // store data in auth context
      if(response.data?.user){
        auth?.handleSetUser(response.data.user);
        let user = response.data.user;
        user['role'] = response.data.user.account_type; // set role based on account_type
        localStorage.setItem('current_user', JSON.stringify(user));
        localStorage.setItem('token', response.data.access_token);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });

        // If a next param exists, go there. Otherwise default by role.
        if (next) {
          navigate(next);
          return;
        }

        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }
       
      } catch (error) {
         toast({
          title: "Login Failed",
          description: error.message || "Invalid email or password.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
  };

  // const handleLogin = async (data: LoginFormData) => {
  //   setIsSubmitting(true);

  //   try {
  //     const user = await auth.login(data.email, data.password);

  //     toast({
  //       title: "Login Successful",
  //       description: `Welcome back, ${user.firstName}!`,
  //     });

  //     // If a next param exists, go there. Otherwise default by role.
  //     if (next) {
  //       navigate(next);
  //       return;
  //     }

  //     if (user.role === 'admin') {
  //       navigate('/admin');
  //     } else {
  //       navigate('/home');
  //     }
  //   } catch (error: any) {
  //     toast({
  //       title: "Login Failed",
  //       description: error.message || "Invalid email or password.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data);
  };

  return (
    <div className="min-h-screen modern-gradient">
      
      {/* Hero Section */}
      <div className="relative py-12 text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/80 rounded-full shadow-lg">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome Back to <span className="text-primary">Bukid ni Manang</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
            Farm & Resort in Calbayog City, Samar
          </p>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Sign in to your account to manage bookings and access exclusive features.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-16 flex items-center justify-center">
        <Card className="w-full max-w-md glass-effect border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Access your Bukid ni Manang account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="juan@example.com" 
                          {...field} 
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                            data-testid="input-password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  data-testid="button-login"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="font-medium text-primary hover:underline"
                  data-testid="link-register"
                >
                  Create account here
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Want to explore first?{" "}
                <Link 
                  to="/home" 
                  className="font-medium text-primary hover:underline"
                  data-testid="link-home"
                >
                  View our resort
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}