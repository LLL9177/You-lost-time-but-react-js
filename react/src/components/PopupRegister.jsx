import { useContext, useState } from "react";
import { BACKENDURLContext } from "../BackendURLContext";
import { fetchData } from "../fetchData";
import { setCookie } from "../cookies";
import { UserAgentTypeContext } from "../UserAgentType";

export default function PopupRegister({ isRegistered, setIsRegistered, setMessage }) {
    console.log(isRegistered);
    if (isRegistered) return null;

    const BACKENDURL = useContext(BACKENDURLContext);
    const deviceType = useContext(UserAgentTypeContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleRegisterSubmit(e) {
        e.preventDefault();
        fetchData(BACKENDURL+"/auth/register", {
            username: username, password: password
        })
            .then(result => {
                if (result.username) {
                    setCookie("username", result.username);
                    setUsername(result.username)
                    setIsRegistered(true);
                }
                if (result.message != null) {
                    setMessage(result.message)
                }
                if (result.error) {
                    setMessage(result.error);
                }
            })
    }

    return (
        <>
            <div className={deviceType == "desktop" ? "popup-register" : "popup-register_MOBILE"}>
                <h1>Seems like you don't have an account. Create a new one.</h1>
                <form
                    onSubmit={(e) => (handleRegisterSubmit(e))}
                >
                    <input 
                        type="text" 
                        name="username" 
                        onChange={(e) => {setUsername(e.target.value)}}
                        value={username}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        onChange={(e) => {setPassword(e.target.value)}}
                        value={password}
                    />
                    <button>Register</button>
                </form>
            </div>
            <div className="popup-dimmer"></div>
        </>
    )
}