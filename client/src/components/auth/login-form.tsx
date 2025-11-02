"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HttpClient from "@/lib/axiosInstance.ts";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, handleSetUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log('Login form submitted:', values);

    try {
       const response = await HttpClient.post('/auth/login',values); 
        // store data in auth context
        if(response.data?.user){
          handleSetUser(response.data.user);
          let user = response.data.user;
          user['role'] = response.data.user.account_type; // set role based on account_type
          localStorage.setItem('current_user', JSON.stringify(user));
          localStorage.setItem('token', response.data.access_token);
          toast({
            title: "Login Successful",
            description: `Welcome back, ${user.name}!`,
          });
          // Redirect based on user role
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/"); // Redirect regular users to the tour page
          }
        }
         
        } catch (error) {
           toast({
            title: "Login Failed",
            description: error.message || "Invalid email or password.",
            variant: "destructive",
          });
        } finally {
        }

    // try {
    //   console.log('Attempting login...');
    //   const user = await login(values.email, values.password);
    //   console.log('Login response:', user);

    //   toast({
    //     title: "Success!",
    //     description: `Welcome back, ${user.firstName}!`,
    //   });

    //   // Redirect based on user role
    //   if (user.role === "admin") {
    //     navigate("/admin");
    //   } else {
    //     navigate("/tour"); // Redirect regular users to the tour page
    //   }
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: error instanceof Error ? error.message : "Something went wrong",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled={isLoading} />
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
                    <Input {...field} type="password" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}