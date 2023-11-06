import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [activeButton, setActiveButton] = useState("weekly");

  const url = `http://api.weatherapi.com/v1/forecast.json?key=f86fe9687a564684b5a124939230611&q=${location}&days=5&aqi=no&alerts=no`;

  useEffect(() => {
    if (searchTriggered) {
      axios.get(url).then((res) => {
        setData(res.data);
        const date = res.data.forecast.forecastday[(0, 1, 2, 3, 4)].date;
        const dateObject = new Date(date);
        const day = dateObject.getDate();
        const formattedDate = day.toString().padStart(2, "0");
        setFormattedDate(formattedDate);
        console.log(res.data);
      });
      setSearchTriggered(false);
      setLocation("");
    }
  });

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((res) => {
        setData(res.data);
      });
    }
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="content">
          {data.location ? <h1>{data.location.name}</h1> : null}
          {data.current ? <h1>{data.current.temp_c}&deg;</h1> : null}
          {data.current ? <h3>{data.current.condition.text}</h3> : null}
          <div className="stats">
            {data.current ? <h3>H.{data.current.humidity}&deg;</h3> : null}
            {data.current ? <h3>H.{data.current.wind_kph}km/h</h3> : null}
          </div>
        </div>
        <div className="days">
          <div className="all-data">
            <div className="bottom-content">
              <div className="Hourly-forecast">
                <button
                  className={activeButton === "hourly" ? "active" : "inactive"}
                  onClick={() => handleButtonClick("hourly")}
                >
                  Hourly-Forecast
                </button>
                <button
                  className={activeButton === "weekly" ? "active" : "inactive"}
                  onClick={() => handleButtonClick("weekly")}
                >
                  Weekly Forecast
                </button>
              </div>
              <div className="forecast">
                {data.forecast &&
                  data.forecast.forecastday
                    .slice(1) // Skip the first element
                    .map((day, index) => {
                      const dateObject = new Date(day.date);
                      const dayOfMonth = dateObject.getDate();
                      const formattedDate = dayOfMonth
                        .toString()
                        .padStart(2, "0");

                      return (
                        <div className="card1" key={index}>
                          <h3>{formattedDate}</h3>
                          <img
                            src={day.day.condition.icon}
                            alt={day.day.condition.text}
                          />
                          <h4>{day.day.maxtemp_c}&deg;</h4>
                        </div>
                      );
                    })}
              </div>

              {/* <div className="forecast">
                <div className="card1">
                  {formattedDate ? <h3>{formattedDate}</h3> : null}

                  <img src="images/Moon cloud fast wind.png" alt="" />
                  <h4>19&deg;</h4>
                </div>
                <div className="card1">
                  <h5>12AM</h5>
                  <img src="images/Moon cloud fast wind.png" alt="" />
                  <h4>19&deg;</h4>
                </div>
                <div className="card1">
                  <h5>12AM</h5>
                  <img src="images/Moon cloud fast wind.png" alt="" />
                  <h4>19&deg;</h4>
                </div>
                <div className="card1">
                  <h5>12AM</h5>
                  <img src="images/Moon cloud fast wind.png" alt="" />
                  <h4>19&deg;</h4>
                </div>
              </div> */}
              <div className="input-city">
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter" && event.key !== " ") {
                      event.preventDefault();
                      handleSearch();
                    }
                  }}
                  type="text"
                  placeholder="Enter Your City"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
