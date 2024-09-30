import React from "react";
import station from '../assets/stations.json';
import schedule from "../assets/schedules.json"
import train from '../assets/trains.json';

// console.log(station.features[0]);
// console.log(schedule[0]);
console.log(train.features[0].geometry.coordinates);

const PNRstatus = () => {
    return (
        <>
            <div className="w-full max-w-md">
                <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-800">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Search by Train</h3>
                    <input
                        type="text"
                        placeholder="Select Train No."
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button className="w-full bg-blue-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-900 focus:outline-none transition duration-300">
                        Check Status
                    </button>
                </div>
            </div>
        </>
    );
};

export default PNRstatus;
