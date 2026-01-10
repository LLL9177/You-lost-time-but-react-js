import { useState, useContext } from "react";
import { BACKENDURLContext } from "../BackendURLContext";
import { UserContext } from "../UserContext";
import { fetchData } from "../fetchData";

export default function LostTimeForm({ setMessage, resetUser }) {
    const [lostTime, setLostTime] = useState('');
    const BACKENDURL = useContext(BACKENDURLContext);
    const user = useContext(UserContext);

    function handleSubmit(e) {
        e.preventDefault();
        if (user != "user") {
            fetchData(BACKENDURL+"/post/time", {username: user.username, time_value: lostTime})
                .then(result => {
                    setLostTime('');
                    if (result.error) {
                        setMessage(result.error)
                    } else {
                        resetUser(); // Trigger rerender so it fetches user with correct data.
                    }
                })
        }
    }
    
    return (
        <form className="lost-time_form" onSubmit={handleSubmit}>
            <input 
                type="number" 
                name="time_lost" 
                required 
                onChange={(e) => {setLostTime(e.target.value)}}
                value={lostTime}
            />
            <button
                type="submit"
            >
                Submit my time
            </button>
        </form>
    )
}