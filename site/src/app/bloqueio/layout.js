import localFont from "next/font/local";
import "../globals.css";
import Menu from "@components/Menu.js";
/*
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
*/

export const metadata = {
  title: "Bloqueios | BlockED"
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
	<Menu />
        {children}
      </body>
    </html>
  );
}
