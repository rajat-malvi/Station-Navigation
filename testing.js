// for spliting coordinates 
const stationData = stationName.map(station => {
    const [lat, lng] = station.loc.split(",").map(coord => parseFloat(coord.trim()));
    return {
      name: station.name,
      lat: lat,
      lng: lng
    };
  });
console.log(stationData);


