"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  ),
});

export default function HomePage() {
  return <Dashboard />;
}
