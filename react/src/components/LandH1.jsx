import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function LandH1() {
    const user = useContext(UserContext);

    if (user.username) {
        return <h1 id="h1">Your lost time from {user.creation_date}.</h1>
    } else {
        return <h1 id="h1">Your lost time from the moment you've registered.</h1>
    }
}