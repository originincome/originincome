import type {Metadata,Viewport} from "next";
import {Inter,Manrope} from "next/font/google";
import "./globals.css";
const inter=Inter({subsets:["latin"],variable:"--font-body"});
const manrope=Manrope({subsets:["latin"],variable:"--font-display"});
export const metadata:Metadata={metadataBase:new URL("https://originincome.com"),title:"Origin Income — Baue heute. Lebe morgen.",description:"Dein KI-gestütztes System für ein zweites Einkommen.",openGraph:{title:"Origin Income",description:"Baue heute. Lebe morgen.",url:"https://originincome.com",siteName:"Origin Income",locale:"de_CH",type:"website"}};
export const viewport:Viewport={themeColor:"#050505",colorScheme:"dark"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="de"><body className={`${inter.variable} ${manrope.variable}`}>{children}</body></html>}
