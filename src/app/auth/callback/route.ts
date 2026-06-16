import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DEFAULT_NEXT = "/login?confirmed=1";

function isExpiredError(message: string, code: string | null) {
  const lower = message.toLowerCase();
  return (
    code === "otp_expired" ||
    code === "expired_token" ||
    code === "flow_state_expired" ||
    lower.includes("expired") ||
    lower.includes("invalid or has expired")
  );
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description") ?? "";
  const next = searchParams.get("next") ?? DEFAULT_NEXT;

  if (
    error ||
    isExpiredError(errorDescription, errorCode) ||
    errorCode === "access_denied"
  ) {
    const redirectUrl = isExpiredError(errorDescription, errorCode)
      ? `${origin}/login?error=expired`
      : `${origin}/login?error=auth`;
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();

  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[auth/callback] exchangeCodeForSession:", exchangeError);

    if (isExpiredError(exchangeError.message, exchangeError.code ?? null)) {
      return NextResponse.redirect(`${origin}/login?error=expired`);
    }
  }

  if (tokenHash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "signup" | "email" | "recovery" | "email_change",
    });

    if (!verifyError) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[auth/callback] verifyOtp:", verifyError);

    if (isExpiredError(verifyError.message, verifyError.code ?? null)) {
      return NextResponse.redirect(`${origin}/login?error=expired`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
