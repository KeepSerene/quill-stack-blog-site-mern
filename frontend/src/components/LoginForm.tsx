/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type React from "react";
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Link, useFetcher, useNavigate } from "react-router";
import type {
  ActionResponse,
  AuthResponse,
  ErrorResponse,
  ValidationError,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/PasswordInput";
import { Button } from "./ui/button";
import { Loader, LogIn } from "lucide-react";
import { toast } from "sonner";

type LoginFormField = "email" | "password";

const LOGIN_FORM_TEXTS = {
  title: "Welcome Back",
  description: "Sign in to your QuillStack account",
  footerText: "Don't have an account?",
} as const;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const loginFormSchema = z.object({
  email: z
    .email({ error: "Please provide a valid email address!" })
    .min(1, "Email is required!")
    .trim()
    .max(50, "Email cannot exceed 50 characters!"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters!")
    .refine((value) => passwordRegex.test(value), {
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number!",
    }),
});

function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const loginResponse = fetcher.data as ActionResponse<AuthResponse>;
  const isLoading = fetcher.state !== "idle";

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle server responses
  useEffect(() => {
    if (!loginResponse) return;

    if (loginResponse.ok) {
      navigate("/", { replace: true, viewTransition: true });

      return;
    }

    if (!loginResponse.error) return;

    if (loginResponse.error.code === "AuthenticationError") {
      const authorizationError = loginResponse.error as ErrorResponse;

      toast.error(authorizationError.message, {
        position: "top-center",
        duration: 5000,
      });
    }

    if (loginResponse.error.code === "ValidationError") {
      const validationErrors = loginResponse.error as ValidationError;

      Object.entries(validationErrors.errors).forEach((value) => {
        const [_, validationError] = value;
        const fieldName = validationError.path as LoginFormField;
        form.setError(
          fieldName,
          {
            type: "custom",
            message: validationError.message,
          },
          { shouldFocus: true }
        );
      });
    }
  }, [loginResponse]);

  // Handle submit
  const onSubmit = useCallback(
    async (values: z.infer<typeof loginFormSchema>) => {
      try {
        await fetcher.submit(values, {
          method: "post",
          action: "/login",
          encType: "application/json",
        });
      } catch (error) {
        console.error("Error submitting login form:", error);
        toast.error("Failed to submit login form!", {
          position: "top-center",
          duration: 5000,
        });
      }
    },
    []
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="p-0 overflow-hidden">
        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <section className="flex flex-col gap-6">
                <header className="text-center flex flex-col items-center">
                  <h1 className="text-2xl font-semibold">
                    {LOGIN_FORM_TEXTS.title}
                  </h1>

                  <p className="text-muted-foreground text-balance">
                    {LOGIN_FORM_TEXTS.description}
                  </p>
                </header>

                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>

                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>

                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="size-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="size-4" />
                      <span>Sign in</span>
                    </>
                  )}
                </Button>
              </section>

              <footer className="text-sm text-center mt-4">
                {LOGIN_FORM_TEXTS.footerText}{" "}
                <Link
                  to="/register"
                  className="underline underline-offset-4 transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                  viewTransition
                >
                  Sign up
                </Link>
              </footer>
            </form>
          </Form>

          {/* Login page banner */}
          <figure className="hidden md:block bg-muted relative">
            <img
              src="/images/login-banner.jpg"
              alt=""
              width={400}
              height={400}
              className="size-full object-cover absolute inset-0"
            />
          </figure>
        </CardContent>
      </Card>

      <footer className="text-muted-foreground text-center text-xs text-balance transition-colors duration-200 *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary *:[a]:focus-visible:text-primary">
        By continuing, you agree to our <a href="#"> Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </footer>
    </div>
  );
}

export default LoginForm;
