"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { UserPlus } from 'lucide-react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      toast({
        title: "Account created!",
        description: "Your account has been created. Please log in to continue.",
      });
      router.push("/login");
    } catch (error: any) {
      let message = "Failed to create account.";
      if (error.code === "auth/email-already-in-use") message = "Email is already in use.";
      else if (error.code === "auth/invalid-email") message = "Invalid email address.";
      else if (error.code === "auth/weak-password") message = "Password should be at least 6 characters.";
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gradient-to-br from-accent/10 to-background">
      <Card className="w-full max-w-sm shadow-2xl border-2 border-accent/60 rounded-2xl relative overflow-visible">
        <div className="flex justify-center -mt-12 mb-2">
          <div className="bg-accent p-4 rounded-full shadow-lg">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-accent drop-shadow">Sign Up</CardTitle>
          <CardDescription className="text-base mt-2 text-muted-foreground">Create an account to start planning your trips.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-accent hover:bg-accent/90 text-lg py-3 rounded-xl shadow-md transition-all" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline text-accent font-semibold">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
