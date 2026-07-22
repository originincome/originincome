import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-poppins" });
export const metadata: Metadata = {metadataBase:new URL("https://originincome.com"),title:{default:"Origin Income — Baue heute. Lebe morgen.",template:"%s | Origin Income"},description:"Dein persönlicher Weg zu einem zweiten, stabilen Einkommen — Schritt für Schritt, KI-gestützt und für langfristigen Erfolg.",keywords:["zweites Einkommen","KI Business","Online Business","Unternehmertum","Origin Income"],openGraph:{title:"Origin Income — Baue heute. Lebe morgen.",description:"Ein personalisiertes System für den Aufbau eines zweiten Einkommens.",url:"https://originincome.com",siteName:"Origin Income",locale:"de_CH",type:"website"},twitter:{card:"summary_large_image",title:"Origin Income — Baue heute. Lebe morgen.",description:"Schritt für Schritt. KI-gestützt. Für langfristigen Erfolg."},robots:{index:true,follow:true}};
export const viewport: Viewport = {themeColor:"#050505",colorScheme:"dark"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body className={`${inter.variable} ${poppins.variable}`}>{children}</body></html>}
