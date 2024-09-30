import React, { useState, useEffect } from "react";
import "../assets/RailwayNavigation.css";
import { stationData, stationName, stationJson } from "../config";
import Header from "./Header";

const RailwayNavigation = () => {
  const [startCoords, setStartCoords] = useState("");
  const [endCoords, setEndCoords] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [rightOptions, setRightOptions] = useState([]);
  const [selectedRightOption, setSelectedRightOption] = useState("");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (startCoords && endCoords) {
      updateMap(startCoords, endCoords);
    }
  }, [startCoords, endCoords]);

  useEffect(() => {
    if (googleMapsLink) {
      const handleRedirection = () => {
        if (window.innerWidth <= 768) {
          // For mobile devices, redirect
          window.location.href = googleMapsLink;
        }
      };

      // Call handleRedirection for mobile devices
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

  const populateLeftSelect = () =>
    stationName.map((station, index) => (
      <option key={index} value={station}>
        {station}
      </option>
    ));

  const populateRightSelect = () =>
    rightOptions.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ));

  const handleStartSelect = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "current") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = `${position.coords.latitude},${position.coords.longitude}`;
            setStartCoords(coords);
          },
          () => alert("Unable to get current location.")
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    } else {
      setStartCoords(selectedValue);
    }
  };

  const handleEndSelect = (event) => {
    setEndCoords(event.target.value);
  };

  const handleStationSelect = (event) => {
    console.log("handleStationSelect " + event.target.value);
    
    setSelectedStation(event.target.value);
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

    // Set URL for iframe or redirect
    if (window.innerWidth <= 768) {
      setGoogleMapsLink(geoUrl); // Mobile - redirect
    } else {
      setGoogleMapsLink(""); // Clear redirect URL for desktop
    }

    const mapURL = `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3557.2758816308233!2d${startLng}!3d${startLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m14!3e2!4m5!1s0x399bfd0d9c4a5e49%3A0x3a400d79d1a4f717!2s${startLat}%2C${startLng}!3m2!1d${startLat}!2d${startLng}!4m5!1s0x399bfd0f7dbcd935%3A0x8288f1d3caa571b7!2s${endLat}%2C${endLng}!3m2!1d${endLat}!2d${endLng}!5e0!3m2!1sen!2sin&z=${zoomLevel}&markers=${startLat},${startLng}&markers=${endLat},${endLng}&markers=color:red%7Clabel:S%7C${startLat},${startLng}&markers=color:green%7Clabel:E%7C${endLat},${endLng}`;
    
    setMapUrl(mapURL);
  };

  const checkLocation = (lat, lng) => {
    const stationLat = 28.6139; // Example station latitude
    const stationLng = 77.2090; // Example station longitude
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

  function haversineDistance(coord1, coord2) {
    const R = 6371.0; // Radius of the Earth in kilometers
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const lat1 = toRadians(coord1[0]);
    const lon1 = toRadians(coord1[1]);
    const lat2 = toRadians(coord2[0]);
    const lon2 = toRadians(coord2[1]);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));

    const distance = R * c;
    return Math.floor(distance*1000);
  }

  return (
    <div className="railway-navigation">
      <Header />
      <h1>Railway Station Navigation</h1>

      <div className="dropdown-container">
          <div className="flex justify-between w-5/12">
            <select name="" id="searchByRail">
              <option value="">Train Number...</option>
            </select>
            <h3 className="py-2">OR</h3>
            <select id="stationSelect" onChange={handleStationSelect}>
              <option value="">Select Station...</option>
              {populateLeftSelect()}
            </select>
          </div>

        <span className="arrow">→</span>

        <select id="rightSelect" onChange={handleRightSelect}>
          <option value="">Select Option...</option>
          {populateRightSelect()}
        </select>
      </div>

      {mapUrl && (
        <iframe
          id="mapFrame"
          src={mapUrl}
          style={{ width: '100%', height: '500px', border: 'none' }}
          title="Map"
        ></iframe>
      )}

      {googleMapsLink && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.innerWidth <= 768) {
                window.location.href = "${googleMapsLink}";
              }
            `,
          }}
        />
      )}

      <div className="slider-container">
        <div className="cards-slider">
          {cards
            .map((card) => ({
              ...card,
              distance: haversineDistance(startCoords.split(","), card.Geocodes),
            }))
            .sort((a, b) => a.distance - b.distance) // Sort by distance
            .map((card, index) => (
              <div className="card cursor-pointer" key={index} onClick={() => handleCardClick(card)}>
                <h3>{card.name.length > 15 ? `${card.name.slice(0, 15)}...` : card.name}</h3>
                <p>{card.distance} meter</p>
              </div>
            ))}
        </div>
      </div>


    </div>
  );
};

export default RailwayNavigation;
