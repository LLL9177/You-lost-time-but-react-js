import { useContext } from "react";
import { UserAgentTypeContext } from "../UserAgentType";

export default function RegisterAgain({ resetUser, deleteCookie}) {
    const deviceType = useContext(UserAgentTypeContext);
    if (deviceType !== "desktop") return null;

    return (
        <button 
            className="register-again"
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