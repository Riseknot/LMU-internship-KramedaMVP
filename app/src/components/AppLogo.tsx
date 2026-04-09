import Image from "next/image";
import LumiLogo from "@/src/assets/Lumi_Logo_Blue.png";

export function AppLogo() {
  return (
                <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/30 via-sky-300/25 to-violet-300/30 blur-2xl" />
              <h1 className="relative bg-gradient-to-r from-amber-100 via-sky-200 to-violet-200 bg-clip-text pl-[0.15em] text-xl font-black tracking-[0.36em] text-transparent drop-shadow-[0_0_24px_rgba(126,220,255,0.18)] ">
                LUMI
              </h1>
            </div>
  );
}