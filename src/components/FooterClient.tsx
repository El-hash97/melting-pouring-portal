"use client";

import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function FooterClient() {
  return <Footer />;
}
