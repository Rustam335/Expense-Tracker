import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ledger — Personal Finance Dashboard",
  description:
    "A premium, fully client-side expense tracker. Track income and expenses, visualize spending with charts, and filter your transactions — all stored locally in your browser.",
};

// Set the theme class before paint to avoid a flash of the wrong theme.
// Defaults to LIGHT when no preference is stored; honors a persisted choice.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("expense-tracker:theme");
    if (stored === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="app-backdrop" aria-hidden="true">
          <div className="app-grid" />
        </div>
        {children}
      </body>
    </html>
  );
}
