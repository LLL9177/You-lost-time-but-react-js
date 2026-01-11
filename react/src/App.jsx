import { useEffect, useState, useContext } from "react"
import { UserContext } from "./UserContext.js";
import { BACKENDURLContext } from "./BackendURLContext.js";
import { UserAgentTypeContext } from "./UserAgentType.js";
import TimeLostCounter from "./components/TimeLostCounter.jsx"
import LostTimeForm from "./components/LostTimeForm.jsx";
import Flashes from "./components/Flashes.jsx";
import LandH1 from "./components/LandH1.jsx";
import LossesBook from "./components/LossesBook.jsx";
import PopupRegister from "./components/PopupRegister.jsx";
import { fetchData } from "./fetchData.js";
import { getCookie, deleteCookie } from "./cookies.js";
import RegisterAgain from "./components/RegisterAgain.jsx";
import RegisterAgainMob from "./components/RegisterAgainMob.jsx";

const backgrounds = ["/1.jpg", "/2.jpg", "/3.jpg"];

function getDeviceType(userAgent) {
  const ua = userAgent.toLowerCase();

  if (["android", "iphone", "ipad", "mobile"].some(x => ua.includes(x))) {
    return "mobile";
  }

  return "desktop";
}

export default function App() {
    const [user, setUser] = useState("user");
    const BACKENDURL = useContext(BACKENDURLContext);
    const [message, setMessage] = useState(sessionStorage.getItem("_flashes"));
    const [bg, setBg] = useState(null);
    const [isRegistered, setIsRegistered] = useState(getCookie("username") ? true : false);
    const deviceType = getDeviceType(navigator.userAgent)

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
        <UserAgentTypeContext value={deviceType}>
          <BACKENDURLContext value={BACKENDURL}>
            <UserContext value={user}>
                {/* Since register agains must have different positions depending on
                the device type, We'll do the annoying thing like this */}
                <RegisterAgainMob 
                  resetUser={resetUser}
                  deleteCookie={deleteCookie}
                />
                <LossesBook  />
                <LandH1 />
                <TimeLostCounter />
                <label 
                  htmlFor="h1"
                  id="label_MOBILE"
                >How much time did you lose today in minutes?</label>
                <LostTimeForm setMessage={setMessage} resetUser={resetUser} />
                <PopupRegister 
                  isRegistered={isRegistered} 
                  setIsRegistered={setIsRegistered} 
                  setMessage={setMessage}
                />
                <RegisterAgain 
                  resetUser={resetUser}
                  deleteCookie={deleteCookie}
                />
                <div className="dimmer"></div>
                <Flashes message={message} />
            </UserContext>
          </BACKENDURLContext>
        </UserAgentTypeContext>
      </div>
    )
}