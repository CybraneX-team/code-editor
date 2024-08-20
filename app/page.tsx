import HomeScreen from "@/components/homeScreen";
import Link from "next/link";
import { AppProps } from 'next/app';

export default function Home() {

  return (
    <main className="flex  min-h-screen flex-col gap-10 p-24">
      <HomeScreen />
    </main>
  );
}
