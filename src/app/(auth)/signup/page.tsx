import { Metadata } from "next";
import signUpImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-4xl font-bold">Sign up</h1>
            <p className="text-muted-foreground">
              Your amazing experience starts now
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link
              href={"/signin"}
              className="block text-center hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
        <Image
          src={signUpImage}
          alt="Sign up image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
