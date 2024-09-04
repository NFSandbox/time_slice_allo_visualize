import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Toaster} from "react-hot-toast";

// AntDesign Utils
import {AntdRegistry} from '@ant-design/nextjs-registry';

// Components
import {AdaptiveBackground} from '@/components/background';

const inter = Inter({subsets: ["latin"]});

// Import globally as dep. For package class-transform to work as intend
import 'reflect-metadata';

// Page MetaData
export const metadata: Metadata = {
  title: "Time Slice Algorithm Visualizer",
  description: "Made by Oyasumi, for AHU OS Design.",
};

export default function Layout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
    <body className={inter.className}>
    {/*Add Ant Registry to avoid first loading page flicker*/}
    <AntdRegistry>
      <AdaptiveBackground>
        <Toaster/>
        {children}
      </AdaptiveBackground>
    </AntdRegistry>
    </body>
    </html>
  );
}
