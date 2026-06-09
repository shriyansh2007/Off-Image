"use client"
import React from "react";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import { useStoreUser, useStoreUserEffect } from "../hooks/useStoreUserEffect";
import { useUser } from "@clerk/nextjs";
import { Unauthenticated, Authenticated } from "convex/react";
import { LayoutDashboard } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
const Header = () => {
    const path = usePathname();
    const { isLoading } = useStoreUserEffect();
    if(path.includes("/editor")){
        return null;    

    }
    return (
        <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 text-nowrap">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-8 py-3 flex items-center justify-center gap-8">
                <Link href="/" className="text-lg font-bold text-white gap-8">
                </Link>
                
                    <div className="hidden md:flex space-x-6">
                        <Link href="#features" className="text-white font-medium transistion-all duration-300 hover:text-cyan-400 cursor-pointer">
                            Features
                        </Link><Link href="#pricing" className="text-white font-medium transistion-all duration-300 hover:text-cyan-400 cursor-pointer">
                            Pricing
                        </Link>
                        <Link href="#contact" className="text-white font-medium transistion-all duration-300 hover:text-cyan-400 cursor-pointer">
                            Contact
                        </Link></div>

                
                <div className="flex items-center gap-3 ml-10 md:ml-20"><Unauthenticated>
                    <SignInButton />
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </Unauthenticated>
                    <Authenticated>
                        <Link href="/dashboard"><button><LayoutDashboard /></button></Link>

                        <UserButton />
                    </Authenticated></div>
                    {isLoading &&(
                        <div className="fixed bottom-0 left-0 w-full z-49 flex justify-center"><BarLoader width={"95%"} color="#06b6d4" /></div>
                    ) }

            </div>

        </header>

    )
}
export default Header