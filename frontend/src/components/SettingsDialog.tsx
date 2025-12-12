/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import z from "zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import type React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetcher } from "react-router";
import useUser from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AtSign, Globe, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/PasswordInput";
import { toast } from "sonner";
import type { ActionResponse } from "@/types";

const usernameRegex = /^[a-zA-Z0-9_-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters!")
    .max(20, "First name cannot exceed 20 characters!")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters!")
    .max(20, "Last name cannot exceed 20 characters!")
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters!")
    .max(20, "Username cannot exceed 20 characters!")
    .regex(
      usernameRegex,
      "Username can only contain letters, numbers, underscores, and hyphens!"
    )
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, "Email is required!")
    .max(50, "Email cannot exceed 50 characters!")
    .regex(emailRegex, "Please provide a valid email address!")
    .toLowerCase()
    .trim()
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .url("Please provide a valid URL!")
    .max(100, "Website URL cannot exceed 100 characters!")
    .optional()
    .or(z.literal("")),
});

function ProfileSettingsForm() {
  const fetcher = useFetcher();
  const actionResponseData = fetcher.data as ActionResponse;
  const user = useUser();
  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (actionResponseData && actionResponseData.ok) {
      toast.success("Your profile has been updated successfully!");
    }
  }, [actionResponseData]);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      websiteUrl: "",
    },
  });

  // reset form values when user data loads
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: "",
        lastName: "",
        username: user.username || "",
        email: user.email || "",
        websiteUrl: "",
      });
    }
  }, [user, form]);

  const onSubmit = useCallback(
    async (values: z.infer<typeof profileFormSchema>) => {
      try {
        // only send non-empty values to backend
        const payload = Object.fromEntries(
          Object.entries(values).filter(([_, value]) => value !== "")
        );

        await fetcher.submit(payload, {
          method: "post",
          action: "/settings",
          encType: "application/json",
        });
      } catch (error) {
        console.error("Error submitting profile form:", error);
        toast.error("Failed to submit profile form!", {
          position: "top-center",
          duration: 5000,
        });
      }
    },
    [fetcher]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <header>
          <h3 className="text-lg font-semibold">Profile</h3>

          <p className="text-muted-foreground text-sm">
            Update your personal details.
          </p>
        </header>

        <Separator className="my-5" />

        {/* Full name: first name + last name */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] items-start gap-4">
          <h4
            className={cn(
              "text-sm font-medium leading-none",
              (form.formState.errors.firstName ||
                form.formState.errors.lastName) &&
                "text-destructive"
            )}
          >
            Full Name
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 max-md:gap-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:sr-only">First Name</FormLabel>

                  <FormControl>
                    <Input type="text" placeholder="John" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:sr-only">Last Name</FormLabel>

                  <FormControl>
                    <Input type="text" placeholder="Doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Separator className="my-5" />

        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] items-start gap-2">
              <FormLabel>Username</FormLabel>

              <div className="space-y-2">
                <div className="relative">
                  <AtSign className="size-4 text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />

                  <FormControl>
                    <Input
                      type="text"
                      placeholder="johndoe"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Separator className="my-5" />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] items-start gap-2">
              <FormLabel>Email Address</FormLabel>

              <div className="space-y-2">
                <div className="relative">
                  <Mail className="size-4 text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Separator className="my-5" />

        {/* Website URL */}
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] items-start gap-2">
              <FormLabel>Website URL</FormLabel>

              <div className="space-y-2">
                <div className="relative">
                  <Globe className="size-4 text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />

                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Separator className="my-5" />

        {/* Action buttons */}
        <div className="flex justify-end items-center gap-3">
          <Button type="button" variant="outline" disabled={isLoading} asChild>
            <DialogClose disabled={isLoading}>Cancel</DialogClose>
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

const passwordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters!")
      .regex(passwordRegex, {
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number!",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match!",
    path: ["confirmPassword"], // shows error on confirmPassword field
  });

function PasswordSettingsForm() {
  const fetcher = useFetcher();
  const actionResponseData = fetcher.data as ActionResponse;
  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (actionResponseData && actionResponseData.ok) {
      toast.success("Your password has been updated successfully!");
    }
  }, [actionResponseData]);

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof passwordFormSchema>) => {
      try {
        // only send password to backend (not confirmPassword)
        await fetcher.submit(
          { password: values.password },
          {
            method: "post",
            action: "/settings",
            encType: "application/json",
          }
        );
      } catch (error) {
        console.error("Error submitting password form:", error);
        toast.error("Failed to submit password form!", {
          position: "top-center",
          duration: 5000,
        });
      }
    },
    [fetcher]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <header>
          <h3 className="text-lg font-semibold">Password</h3>

          <p className="text-muted-foreground text-sm">Set a new password...</p>
        </header>

        <Separator className="my-5" />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] items-start gap-2">
              <FormLabel>New Password</FormLabel>

              <div className="space-y-2">
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Separator className="my-5" />

        {/* Confirm password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] items-start gap-2">
              <FormLabel>Confirm New Password</FormLabel>

              <div className="space-y-2">
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Separator className="my-5" />

        {/* Action buttons */}
        <div className="flex justify-end items-center gap-3">
          <Button type="button" variant="outline" disabled={isLoading} asChild>
            <DialogClose disabled={isLoading}>Cancel</DialogClose>
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function SettingsDialog({
  children,
  ...props
}: React.PropsWithChildren<DialogProps>) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="md:min-w-[80vw] xl:min-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="gap-5">
          <TabsList className="w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettingsForm />
          </TabsContent>

          <TabsContent value="password">
            <PasswordSettingsForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
