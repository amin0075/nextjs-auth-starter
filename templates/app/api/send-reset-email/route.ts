import { NextRequest, NextResponse } from "next/server";
import { mailjetService } from "@/lib/mailjet";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate a reset token (in a real app, you'd store this in your database)
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    await mailjetService.sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 }
    );
  }
}
