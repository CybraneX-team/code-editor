"use client"
import { AppStore, makeStore } from "@/lib/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const storeRef = useRef<AppStore>();
  if(!storeRef.current){
    storeRef.current = makeStore();
  }

  return (
   <Provider store={storeRef.current}>
      <div>
        {children}
      </div>
      </Provider>
  );
}
