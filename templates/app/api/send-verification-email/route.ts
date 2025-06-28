import { NextRequest, NextResponse } from "next/server";
import { mailjetService } from "@/lib/mailjet";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log("email:", email);
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate a verification token (in a real app, you'd store this in your database)
    const verificationToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`;
    console.log("verificationUrl:", verificationUrl);
    await mailjetService.sendVerificationEmail(email, verificationUrl);

    return NextResponse.json({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
