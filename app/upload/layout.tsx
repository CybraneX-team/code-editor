"use client"

import { AppStore, makeStore } from "@/lib/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <div className="min-h-screen bg-gray-100 dark:bg-[#1e1e1e]">
        <main className="container mx-auto">
          {children}
        </main>
      </div>
    </Provider>
  );
}