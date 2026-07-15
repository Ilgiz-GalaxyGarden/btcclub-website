import type { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col text-white">
      <Header />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}