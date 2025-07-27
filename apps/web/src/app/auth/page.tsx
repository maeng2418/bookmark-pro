"use client";

import dynamic from "next/dynamic";

const Auth = dynamic(() => import("@/components/Auth"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

export default function AuthPage() {
  return <Auth />;
}