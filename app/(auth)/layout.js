import "react";
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(200,255,0,0.14),_transparent_38%),linear-gradient(180deg,_#040404_0%,_#0e0e0e_100%)] px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
};
export default AuthLayout