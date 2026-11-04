"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginSchema } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/use-auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const { login, loginLoading, loginError } = useAuth(redirectTo);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    if (!loginLoading) login(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Admin sign in</CardTitle>
        <CardDescription>
          Login to access your portfolio dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              autoComplete="username"
              disabled={loginLoading}
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={loginLoading}
              placeholder="********"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {loginError && (
            <p role="alert" className="text-sm text-red-600">
              {axios.isAxiosError(loginError) &&
              loginError.response?.status === 401
                ? "Email or password is incorrect."
                : axios.isAxiosError(loginError) &&
                    loginError.response?.status === 429
                  ? "Too many sign-in attempts. Please wait before trying again."
                  : "Sign-in could not be verified. Please try again."}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loginLoading}>
            {loginLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
