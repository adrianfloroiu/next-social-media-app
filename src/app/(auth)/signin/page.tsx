import { Metadata } from "next";
import signInImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-4xl font-bold">Sign in</h1>
            <p className="text-muted-foreground">You are just one click away</p>
          </div>
          <div className="space-y-5">
            <SignInForm />
            <Link
              href={"/signup"}
              className="block text-center hover:underline"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        <Image
          src={signInImage}
          alt="Sign in image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
