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
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type RegisterFormField = "role" | "email" | "password";

const REGISTER_FORM_TEXTS = {
  title: "Create your Account",
  description: "Set your role, email, and password below",
  footerText: "Already have an account?",
} as const;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const registerFormSchema = z.object({
  role: z.enum(["admin", "user"], {
    error: "Please provide a valid role!",
  }),
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

function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const registerResponse = fetcher.data as ActionResponse<AuthResponse>;
  const isLoading = fetcher.state !== "idle";

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      role: "user",
      email: "",
      password: "",
    },
  });

  // Handle server responses
  useEffect(() => {
    if (!registerResponse) return;

    if (registerResponse.ok) {
      navigate("/", { replace: true, viewTransition: true });

      return;
    }

    if (!registerResponse.error) return;

    if (registerResponse.error.code === "AuthorizationError") {
      const authorizationError = registerResponse.error as ErrorResponse;

      toast.error(authorizationError.message, {
        position: "top-center",
        duration: 5000,
      });
    }

    if (registerResponse.error.code === "ValidationError") {
      const validationErrors = registerResponse.error as ValidationError;

      Object.entries(validationErrors.errors).forEach((value) => {
        const [_, validationError] = value;
        const fieldName = validationError.path as RegisterFormField;
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
  }, [registerResponse]);

  // Handle submit
  const onSubmit = useCallback(
    async (values: z.infer<typeof registerFormSchema>) => {
      try {
        await fetcher.submit(values, {
          method: "post",
          action: "/register",
          encType: "application/json",
        });
      } catch (error) {
        console.error("Error submitting registration form:", error);
        toast.error("Failed to submit registration form!", {
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
                    {REGISTER_FORM_TEXTS.title}
                  </h1>

                  <p className="text-muted-foreground px-6">
                    {REGISTER_FORM_TEXTS.description}
                  </p>
                </header>

                {/* Role field */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Register as</FormLabel>

                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="rounded-md border border-input p-0.5 grid grid-cols-2 gap-0"
                        >
                          <Label className="w-full h-[34px] text-muted-foreground rounded-l-sm cursor-pointer transition-colors duration-200 hover:text-foreground focus-within:text-foreground has-checked:bg-secondary has-checked:text-secondary-foreground flex justify-center items-center">
                            <RadioGroupItem value="user" className="sr-only" />
                            <span>User</span>
                          </Label>

                          <Label className="w-full h-[34px] text-muted-foreground rounded-r-sm cursor-pointer transition-colors duration-200 hover:text-foreground focus-within:text-foreground has-checked:bg-secondary has-checked:text-secondary-foreground flex justify-center items-center">
                            <RadioGroupItem value="admin" className="sr-only" />
                            <span>Admin</span>
                          </Label>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>

                      <FormControl>
                        <Input
                          autoFocus
                          placeholder="email@example.com"
                          {...field}
                        />
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
                      <Loader2 className="size-4 animate-spin" />
                      <span>Signing up...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus2 className="size-4" />
                      <span>Sign up</span>
                    </>
                  )}
                </Button>
              </section>

              <footer className="text-sm text-center mt-4">
                {REGISTER_FORM_TEXTS.footerText}{" "}
                <Link
                  to="/login"
                  className="underline underline-offset-4 transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                  viewTransition
                >
                  Sign in
                </Link>
              </footer>
            </form>
          </Form>

          {/* Register page banner */}
          <figure className="hidden md:block bg-muted relative">
            <img
              src="/images/register-banner.jpg"
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

export default RegisterForm;
