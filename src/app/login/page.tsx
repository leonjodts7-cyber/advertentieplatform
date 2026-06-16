import { LoginPageContent } from "@/app/login/login-form";

export default function LoginPage() {
  return (
    <div className="login-page flex min-h-[70vh] items-center py-10">
      <div className="container">
        <LoginPageContent />
      </div>
    </div>
  );
}
