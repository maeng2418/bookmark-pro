import type { Metadata } from "next";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: "BookmarkPro - 스마트한 북마크 관리",
  description: "웹과 브라우저 확장프로그램에서 북마크를 효율적으로 관리하세요",
  keywords: ["북마크", "bookmark", "관리", "웹", "확장프로그램"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}