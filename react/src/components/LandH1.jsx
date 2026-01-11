import { use, useContext } from "react";
import { UserContext } from "../UserContext";
import { UserAgentTypeContext } from "../UserAgentType";

export default function LandH1() {
    const user = useContext(UserContext);
    const deviceType = useContext(UserAgentTypeContext);

    if (user.username) {
        return <h1 id={deviceType == "desktop" ? "h1" : "h1_MOBILE"}>Your lost time from {user.creation_date}.</h1>
    } else {
        return <h1 id={deviceType == "desktop" ? "h1" : "h1_MOBILE"}>Your lost time from the moment you've registered.</h1>
    }
}