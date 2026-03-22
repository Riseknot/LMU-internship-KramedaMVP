import logo from "../assets/Lumi_Logo_Blue.png";

export function AppLogo(){
    const logoSrc = typeof logo === 'string' ? logo : logo.src;

    return(
            <img src={logoSrc} alt="Logo of the App"  />
    )
}