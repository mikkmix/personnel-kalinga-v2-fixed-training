import React from "react";
import WeatherCard from "../components/WeatherCard";
import HealthRespondersCard from "../components/HealthRespondersCard";
import ChatPageCard from "./ChatPageCard";
import "../styles/personnel-style.css"; // reuse same css file

const Cards = () => {
  return (
    <div className="cards-row">
      <WeatherCard />
      <HealthRespondersCard />
      <ChatPageCard />
    </div>
  );
};

export default Cards;
