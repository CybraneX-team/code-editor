"use client"
import { AppStore, makeStore } from "@/lib/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
   
      <div>
        {children}
      </div>
   
  );
}
