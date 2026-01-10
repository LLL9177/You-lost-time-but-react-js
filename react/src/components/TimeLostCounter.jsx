import { useContext } from "react";
import { UserContext } from "../UserContext";

function convertMinutes(minutes) {
  class Converter  {
    hours(minutes) {
      return Math.floor(minutes/60);
    };

    days(hours) {
      return Math.floor(hours/24);
    };

    weeks(days) {
      return Math.floor(days/7);
    };
  };

  const convertTo = new Converter;
  let lostTimeM = Number(minutes);
  let lostTimeH = convertTo.hours(lostTimeM);
  let lostTimeD = convertTo.days(lostTimeH);
  let lostTimeW = convertTo.weeks(lostTimeD);
  lostTimeM -= lostTimeH*60;
  lostTimeH -= lostTimeD*24;
  lostTimeD -= lostTimeW*7;

  const parts = [];

  if (lostTimeW) parts.push(`${lostTimeW}W`);
  if (lostTimeD) parts.push(`${lostTimeD}d`);
  if (lostTimeH) parts.push(`${lostTimeH}h`);
  if (lostTimeM) parts.push(`${lostTimeM}m`);

  return parts.join(' ') || "0m";
}

export default function TimeLostCounter() {
    const user = useContext(UserContext);
    let lost = "loading...";
    if (typeof user == "object") {
        lost = convertMinutes(user.time_value);
    }
    return (
        <h1 className="time-lost-counter">
            {lost}
        </h1>
    )
}