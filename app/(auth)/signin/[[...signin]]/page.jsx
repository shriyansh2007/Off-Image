import { SignIn } from "@clerk/nextjs";
import "react";
const SignInPage = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[#C8FF00]/80">Welcome back</p>
        <h1 className="text-3xl font-black tracking-tight text-white">Sign in to your account</h1>
        <p className="text-sm text-white/70">Access your projects, editor, and all your saved assets.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <SignIn path="/signin" routing="path" signUpUrl="/signup" />
      </div>
    </div>
  );
};
export default SignInPage