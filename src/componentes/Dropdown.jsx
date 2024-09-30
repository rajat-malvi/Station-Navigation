import React from "react";
import { stationData, stationName } from "../config";

const Dropdown = ({ startCoords, setStartCoords, endCoords, setEndCoords }) => {
  const populateLeftSelect = () =>
    stationName.map((station, index) => (
      <option key={index} value={`${station.lat},${station.lng}`}>
        {station.name}
      </option>
    ));

  const populateRightSelect = () =>
    stationData.map((station, index) => (
      <option key={index} value={`${station.lat},${station.lng}`}>
        {station.name}
      </option>
    ));

  return (
    <div className="dropdown-container">
      <div className='flex flex-col'>
        <select id="startSelect" onChange={(e) => setStartCoords(e.target.value)}>
          <option value="">Select starting point...</option>
          {populateLeftSelect()}
        </select>

        <select name="" id="" className="mt-4">
          <option value="">Select train no...</option>
        </select>
      </div>

      <span className="arrow">→</span>

      <select id="endSelect" onChange={(e) => setEndCoords(e.target.value)}>
        <option value="">Select destination...</option>
        {populateRightSelect()}
      </select>
    </div>
  );
};

export default Dropdown;
