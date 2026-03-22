import Image from "next/image";
import LumiLogo from "@/src/assets/Lumi_Logo_Blue.png";

export function AppLogo() {
  return (
    <Image
      src={LumiLogo}
      alt="Logo of the App"
    priority={true}   
    />
  );
}