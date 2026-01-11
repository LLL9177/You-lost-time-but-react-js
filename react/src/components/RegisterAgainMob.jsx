import { useContext } from "react";
import { UserAgentTypeContext } from "../UserAgentType";

export default function RegisterAgainMob({ resetUser, deleteCookie}) {
    const deviceType = useContext(UserAgentTypeContext);
    if (deviceType !== "mobile") return null;

    return (
        <button 
            className="register-again_MOBILE"
            onClick={() => {
            deleteCookie("username");
            resetUser();
            window.location.href = '/';
            }}
        >
            Register or log in again
        </button>
    )
}