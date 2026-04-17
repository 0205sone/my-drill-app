// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "単語帳アプリ",
  description: "オリジナルの単語帳アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}