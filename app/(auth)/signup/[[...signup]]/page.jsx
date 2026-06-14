import { SignUp } from "@clerk/nextjs";
import "react";
const SignUpPage = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[#C8FF00]/80">Create your account</p>
        <h1 className="text-3xl font-black tracking-tight text-white">Get started with OffImage</h1>
        <p className="text-sm text-white/70">Sign up for free and start building stunning image projects instantly.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <SignUp path="/signup" routing="path" signInUrl="/signin" />
      </div>
    </div>
  );
};
export default SignUpPage