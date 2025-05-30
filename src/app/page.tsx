import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 pb-20">
      <div className="flex flex-col gap-8 items-center">
        <Image
          src="/logo.png"
          alt="LinkBin logo"
          width={180}
          height={38}
          priority
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to LinkBin</h1>
          <p className="text-lg text-gray-600 mb-8">
            Share your links, images, and text snippets with ease
          </p>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/login"
            className="flex rounded-full items-center justify-center bg-foreground text-background gap-2 font-medium text-sm h-10 px-4"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="flex rounded-full border border-solid items-center justify-center font-medium text-sm h-10 px-4"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}