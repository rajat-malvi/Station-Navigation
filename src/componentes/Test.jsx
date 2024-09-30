import React, { useState, useEffect } from "react";
import "../assets/RailwayNavigation.css";
import { stationData, stationName, stationJson } from "../config";
import Header from "./Header";

const Test = () => {
  const [startCoords, setStartCoords] = useState("");
  const [endCoords, setEndCoords] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [rightOptions, setRightOptions] = useState([]);
  const [selectedRightOption, setSelectedRightOption] = useState("");
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);

  useEffect(() => {
    if (startCoords && endCoords) {
      updateMap(startCoords, endCoords);
    }
  }, [startCoords, endCoords]);

  useEffect(() => {
    if (googleMapsLink) {
      const handleRedirection = () => {
        if (window.innerWidth <= 768) {
          window.location.href = googleMapsLink;
        }
      };
      handleRedirection();
    }
  }, [googleMapsLink]);

  useEffect(() => {
    if (selectedStation) {
      const station = stationJson[selectedStation];
      setRightOptions(Object.keys(station || {}));
      console.log(station.Station);
      
      const coords = station?.Station ? `${station.Station[0]},${station.Station[1]}` : "";
      console.log("coordinates are " + coords);
      setStartCoords(coords);
    } else {
      setRightOptions([]);
    }
  }, [selectedStation]);

  useEffect(() => {
    if (selectedRightOption && selectedStation) {
      const details = stationJson[selectedStation][selectedRightOption] || [];
      setCards(details);
    } else {
      setCards([]);
    }
  }, [selectedRightOption, selectedStation]);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    // Filter station names based on the search term
    if (searchValue.trim() !== "") {
      const filtered = stationName.filter((station) =>
        station.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredStations(filtered);
    } else {
      setFilteredStations([]);
    }
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
    setSearchTerm(station);
    setFilteredStations([]); // Hide suggestions once a station is selected
  };

  const handleRightSelect = (event) => {
    setSelectedRightOption(event.target.value);
  };

  const updateMap = (startCoords, endCoords) => {
    console.log("map" + startCoords);
    if (typeof startCoords === 'string') {
      let startLat, startLng;

      if (startCoords === "current") {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              startLat = position.coords.latitude;
              startLng = position.coords.longitude;
              if (!checkLocation(startLat, startLng)) {
                alert("You are not in Railway station range");
                return;
              }
              setStartCoords(`${startLat},${startLng}`);
              generateMapUrl(startLat, startLng, endCoords);
            },
            () => alert("Unable to get current location.")
          );
        } else {
          alert("Geolocation is not supported by your browser.");
        }
      } else {
        const [lat, lng] = startCoords.split(",");
        if (lat && lng) {
          startLat = lat;
          startLng = lng;
          generateMapUrl(startLat, startLng, endCoords);
        } else {
          alert("Invalid start coordinates.");
        }
      }
    } else {
      alert("Invalid start coordinates.");
    }
  };

  const generateMapUrl = (startLat, startLng, endCoords) => {
    const [endLat, endLng] = endCoords.split(",");
    const distance = calculateDistance(startLat, startLng, endLat, endLng);
    const zoomLevel = distance < 200 ? 22 : distance < 500 ? 20 : 14;

    const googleMapsUrl = `https://www.google.com/maps/dir/${startLat},${startLng}/${endLat},${endLng}`;
    const geoUrl = `geo:${startLat},${startLng}?q=${endLat},${endLng}`;

    if (window.innerWidth <= 768) {
      setGoogleMapsLink(geoUrl);
    } else {
      setGoogleMapsLink("");
    }

    const mapURL = `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3557.2758816308233!2d${startLng}!3d${startLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m14!3e2!4m5!1s0x399bfd0d9c4a5e49%3A0x3a400d79d1a4f717!2s${startLat}%2C${startLng}!3m2!1d${startLat}!2d${startLng}!4m5!1s0x399bfd0f7dbcd935%3A0x8288f1d3caa571b7!2s${endLat}%2C${endLng}!3m2!1d${endLat}!2d${endLng}!5e0!3m2!1sen!2sin&z=${zoomLevel}&markers=${startLat},${startLng}&markers=${endLat},${endLng}&markers=color:red%7Clabel:S%7C${startLat},${startLng}&markers=color:green%7Clabel:E%7C${endLat},${endLng}`;
    
    setMapUrl(mapURL);
  };

  const checkLocation = (lat, lng) => {
    const stationLat = 28.6139;
    const stationLng = 77.2090;
    const distance = calculateDistance(lat, lng, stationLat, stationLng);
    return distance <= 500;
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLng = (lng2 - lng1) * rad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleCardClick = (card) => {
    const cardCoords = `${card.Geocodes[0]},${card.Geocodes[1]}`;
    console.log("cardCoords" + cardCoords);
    updateMap(startCoords, cardCoords);
  };

  return (
    <div className="railway-navigation">
      <Header />
      <h1 className="text-1xl font-bold text-gray-800 leading-tight tracking-wide">Railway Station Navigation</h1>

      <div className="border border-gray-300 rounded-lg shadow-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl mx-auto bg-white">
        <div className="relative w-full sm:w-auto flex-grow">
        <input
          type="text"
          placeholder="Search station..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:w-80 border border-gray-400 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
        />
        {filteredStations.length > 0 && (
          <ul className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
            {filteredStations.map((station, index) => (
              <li
                key={index}
                onClick={() => handleStationClick(station)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b"
              >
                <span className="border border-black border-dotted divide-dotted rounded p-2 mx-2">{station.slice(0, 4)}</span>{station}
              </li>
            ))}
          </ul>
        )}
      </div>

  <span className="text-2xl text-gray-600 hidden sm:block">→</span>

  <select
    id="rightSelect"
    onChange={handleRightSelect}
    className="w-full sm:w-auto border border-gray-400 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
  >
    <option value="">Select Option...</option>
    {rightOptions.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </select>
      </div>


      {mapUrl && (
        <iframe
          id="mapFrame"
          src={mapUrl}
          style={{ width: "100%", height: "500px", border: "none" }}
          title="Map"
        ></iframe>
      )}

      <div className="slider-container">
        <div className="cards-slider">
          {cards
            .map((card) => ({
              ...card,
              distance: calculateDistance(
                startCoords.split(",")[0],
                startCoords.split(",")[1],
                card.Geocodes[0],
                card.Geocodes[1]
              ),
            }))
            .sort((a, b) => a.distance - b.distance)
            .map((card, index) => (
              <div
                key={index}
                className="card"
                onClick={() => handleCardClick(card)}
              >
                <h3>{card.name.length > 20 ? card.name.slice(0,25) : card.name}</h3>
                <p>Distance: {card.distance.toFixed(2)} meters</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Test;
