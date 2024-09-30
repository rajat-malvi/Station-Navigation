import React from "react";

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
    return distance;
}

let Card =({name,start,end})=>{
    let distance = haversineDistance(start,end)
    return(
        <>
            <h1>{name}</h1>
            <p>distance : {distance}</p>
        </>
    )
}


export default Card;