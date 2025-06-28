import { NextRequest, NextResponse } from "next/server";
import { mailjetService } from "@/lib/mailjet";

export async function POST(request: NextRequest) {
  try {
    const { type, email, url } = await request.json();

    if (!email || !url) {
      return NextResponse.json(
        { error: "Email and URL are required" },
        { status: 400 }
      );
    }

    let success = false;

    switch (type) {
      case "verification":
        success = await mailjetService.sendVerificationEmail(email, url);
        break;
      case "password-reset":
        success = await mailjetService.sendPasswordResetEmail(email, url);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
