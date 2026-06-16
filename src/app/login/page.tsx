import { redirect } from "next/navigation";
import { LoginPageContent } from "@/app/login/login-form";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="login-page flex min-h-[70vh] items-center py-10">
      <div className="container">
        <LoginPageContent />
      </div>
    </div>
  );
}
