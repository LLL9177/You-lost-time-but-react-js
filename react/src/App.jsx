import { useEffect, useState, useContext } from "react"
import { UserContext } from "./UserContext.js";
import { BACKENDURLContext } from "./BackendURLContext.js";
import TimeLostCounter from "./components/TimeLostCounter.jsx"
import LostTimeForm from "./components/LostTimeForm.jsx";
import Flashes from "./components/Flashes.jsx";
import LandH1 from "./components/LandH1.jsx";
import LossesBook from "./components/LossesBook.jsx";
import PopupRegister from "./components/PopupRegister.jsx";
import { fetchData } from "./fetchData.js";
import { getCookie, deleteCookie } from "./cookies.js";

const backgrounds = ["/1.jpg", "/2.jpg", "/3.jpg"];

export default function App() {
    const [user, setUser] = useState("user");
    const BACKENDURL = useContext(BACKENDURLContext);
    const [message, setMessage] = useState(sessionStorage.getItem("_flashes"));
    const [bg, setBg] = useState(null);
    const [isRegistered, setIsRegistered] = useState(getCookie("username") ? true : false);

    useEffect(() => {
      if (!isRegistered || user != "user") return;
      const username = getCookie("username");
      if (username) {
        fetchData(BACKENDURL+"/get/user_data", {username: username})
          .then(result => {
            console.log(result);
            if (result.error) {
              setMessage(result.error);
            } else {
              setUser(result.user);
              setIsRegistered(true);
            }
          });
      }
    }, [isRegistered, user]);

    useEffect(() => {
      const random = Math.floor(Math.random()*backgrounds.length);
      setBg(backgrounds[random]);
    }, [])

    function resetUser() {
      setUser("user");
    }

    return (
      <div className="app"
        style = {{
          backgroundImage: bg ? `url(${bg})` : "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          minHeight: "100vh",
        }}
      >
        <BACKENDURLContext value={BACKENDURL}>
          <UserContext value={user}>
              <LossesBook  />
              <LandH1 />
              <TimeLostCounter />
              <label htmlFor="h1">How much time did you lose today in minutes?</label>
              <LostTimeForm setMessage={setMessage} resetUser={resetUser} />
              <PopupRegister 
                isRegistered={isRegistered} 
                setIsRegistered={setIsRegistered} 
                setMessage={setMessage}
              />
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
              <div className="dimmer"></div>
              <Flashes message={message} />
          </UserContext>
        </BACKENDURLContext>
      </div>
    )
}