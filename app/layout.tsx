import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "ICB ERP System - Hệ thống quản lý khách hàng",
  description: "Hệ thống ERP quản lý khách hàng và biểu mẫu chứng nhận của ICB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx("font-sans antialiased", fontSans.className)}>
        <Providers>
          <NextTopLoader
            color="var(--heroui-primary)"
            initialPosition={0.05}
            height={2}
            showSpinner={false}
            template='<div class="bar" role="bar" style="background: linear-gradient(to right, hsl(var(--heroui-primary), hsl(var(--heroui-success) ); height: 3px;">
            <div class="peg"></div>
          </div>'
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
