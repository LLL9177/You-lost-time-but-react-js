import { useEffect, useContext, useState, useRef } from "react";
import { fetchData } from "../fetchData";
import { BACKENDURLContext } from "../BackendURLContext";
import { UserContext } from "../UserContext";
import { UserAgentTypeContext } from "../UserAgentType";

export default function LossesBook() {
  const [dayData, setDayData] = useState(null);
  const [open, setOpen] = useState(false);

  const BACKENDURL = useContext(BACKENDURLContext);
  const deviceType = useContext(UserAgentTypeContext);
  const user = useContext(UserContext);
  let username = null;
  if (user != "user") {
    username = user.username;
  }

  const popupRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (username) {
        fetchData(BACKENDURL + "/get/day_data", {username: username})
          .then(result => setDayData(result))
          .catch(console.error);
    }
  }, [BACKENDURL, username]);

  function lossesImgClick() {
    setOpen(prev => !prev);

    if (!open) {
      if (deviceType == "desktop") {
        popupRef.current.style.transform = "translateX(0)";
        imgRef.current.style.transform = "translateX(450px)";
      } else {
        popupRef.current.style.transform = "translateY(0)";
        imgRef.current.style.transform = "translateY(450px)";
      }
    } else {
      if (deviceType == "desktop") {
        popupRef.current.style.transform = "translateX(-100%)";
        imgRef.current.style.transform = "translateX(0)";
      } else {
        popupRef.current.style.transform = "translateY(-100%)";
        imgRef.current.style.transform = "translateY(0)";
      }
    }
  }

  if (!dayData) return null;

  return (
    <>
      <img
        ref={imgRef}
        src="./book-icon.jpg"
        onClick={lossesImgClick}
        className={deviceType == "desktop" ? "saved-losses" : "saved-losses_MOBILE"}
      />

      <div ref={popupRef} className={deviceType == "desktop" ? "popup-losses" : "popup-losses_MOBILE"} >
        <CloseCross clickFunction={lossesImgClick} />
        <h2 className={deviceType == "desktop" ? "popup-losses_name" : "popup-losses_name_MOBILE"}>Your time losses book</h2>

        <div className={deviceType == "desktop" ? "popup-losses_content" : "popup-losses_content_MOBILE"}>
          {Object.entries(dayData).map(([date, data], index) => (
            <LossesDay
              key={date}
              index={index}
              data={{ [date]: data }}
              open={open}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/* ================= LossesDay ================= */

function LossesDay({ index, data, open }) {
  const sectionRef = useRef(null);
  const moreInfoRef = useRef(null);
  const lineRef = useRef(null);
  const deviceType = useContext(UserAgentTypeContext);

  const [arrowOpen, setArrowOpen] = useState(false);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    sectionRef.current.style.transition = "transform 0.5s ease";

    if (open) {
      if (deviceType == "desktop") {
        sectionRef.current.style.transform = "translateX(-100%)";
        setTimeout(() => {
          sectionRef.current.style.transform = "translateX(0)";
        }, index * 80);
      } else {
        sectionRef.current.style.transform = "translateY(-100%)";
        setTimeout(() => {
          sectionRef.current.style.transform = "translateY(0)";
        }, index * 80);
      }
    } else {
      if (deviceType == "desktop") {
        sectionRef.current.style.transform = "translateX(-100%)";
      } else {
        sectionRef.current.style.transform = "translateY(-100%)";
      }
    }
  }, [open, index, deviceType]);

  function handleDropdownArrowClick(e) {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const dropDownArrow =
      e.currentTarget.querySelector(".dropdown-arrow");

    const lostInDay =
      sectionRef.current.querySelector(".lost-in-day");

    const moreInfo = moreInfoRef.current;
    const lossSomeLine = lineRef.current;

    const targetHeight =
      parseFloat(getComputedStyle(moreInfo).height) - 5;

    const next = !arrowOpen;
    setArrowOpen(next);

    if (next) {
      dropDownArrow.classList.add("open");
      lostInDay.style.paddingBottom = targetHeight + 15 + "px";

      setTimeout(() => {
        moreInfo.style.visibility = "visible";
        moreInfo.style.opacity = "1";

        let h = 0;
        const interval = setInterval(() => {
          if (h < targetHeight) {
            h += 10;
            lossSomeLine.style.height = h + "px";
          } else {
            clearInterval(interval);
            isAnimating.current = false;
          }
        }, 1);
      }, 100);
    } else {
      dropDownArrow.classList.remove("open");
      lostInDay.style.transition = "padding-bottom 0.1s ease";
      moreInfo.style.opacity = "0";

      setTimeout(() => {
        moreInfo.style.visibility = "hidden";
        moreInfo.style.position = "absolute";
        lostInDay.style.paddingBottom = targetHeight + 15 + "px";

        setTimeout(() => {
          lostInDay.style.paddingBottom = "0px";
          isAnimating.current = false;
        }, 100);
      }, 100);
    }
  }

  return (
    <section ref={sectionRef} className="losses-day">
      <Date info={data} index={0} />
      <LostInDay info={data} />

      <div
        className="dropdown-arrow_container"
        onClick={handleDropdownArrowClick}
      >
        <span className="dropdown-arrow">&#9660;</span>
      </div>

      <div ref={moreInfoRef} className="more-info">
        <div ref={lineRef} className={deviceType == "desktop" ? "loss_some-line" : "loss_some-line_MOBILE"}></div>
        {parseObj(data).map(({ time, value }) => (
          <Pair key={time} timeOfDay={time} lostTime={value} />
        ))}
      </div>
    </section>
  );
}

/* ================= Helpers ================= */

function parseObj(obj) {
  if (!obj) return [];

  return Object.entries(obj).flatMap(([date, times]) =>
    Object.entries(times).map(([time, value]) => ({
      date,
      time,
      value
    }))
  );
}

function convertMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes - h * 60;

  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);

  return parts.join(" ") || "0m";
}

function Date({ info, index }) {
  const parsed = parseObj(info);
  if (!parsed[index]) return null;

  return <span className="date">{parsed[index].date}</span>;
}

function LostInDay({ info }) {
  let total = 0;

  for (const times of Object.values(info)) {
    for (const value of Object.values(times)) {
      total += value;
    }
  }

  return <p className="lost-in-day">Lost: {convertMinutes(total)}</p>;
}

function Pair({ timeOfDay, lostTime }) {
  return (
    <div className="more-info_pair">
      <span className="time-of-day">{timeOfDay}</span>
      :&nbsp;
      <p className="popup-losses_lost-time">{convertMinutes(lostTime)}</p>
    </div>
  );
}

function CloseCross({clickFunction}) {
  const deviceType = useContext(UserAgentTypeContext);
  if (deviceType != "mobile") return null;

  return (
    <img 
      src="./public/cross.png"
      class="losses_close-cross"
      onClick={clickFunction}
    />
  )
}