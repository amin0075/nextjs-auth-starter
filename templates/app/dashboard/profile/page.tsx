"use client";

import { useState } from "react";
import { useSession, sendVerificationEmail } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, User, Calendar } from "@/components/ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, isPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSendVerificationEmail = async () => {
    if (!session?.user?.email) {
      setError("No email found in session");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await sendVerificationEmail({
        email: session.user.email,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(result.error.message || "Failed to send verification email");
      } else {
        setSuccess("Verification email sent! Check your inbox.");
      }
    } catch (error) {
      console.error("Error in sendVerificationEmail:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and settings
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your account details and basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={session.user.name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={session.user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input
                value={new Date(session.user.createdAt).toLocaleDateString()}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Verification
            </CardTitle>
            <CardDescription>
              Verify your email address to secure your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Email Status</p>
                <p className="text-sm text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
              <div
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  session.user.emailVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {session.user.emailVerified ? "Verified" : "Not Verified"}
              </div>
            </div>

            {!session.user.emailVerified && (
              <Button
                onClick={handleSendVerificationEmail}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Verification Email
              </Button>
            )}

            {session.user.emailVerified && (
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-green-800">
                  ✅ Your email address has been verified successfully!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Activity
            </CardTitle>
            <CardDescription>
              Recent activity and account timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.user.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.user.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Email Verification Status
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.user.emailVerified
                      ? "Verified"
                      : "Pending verification"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
