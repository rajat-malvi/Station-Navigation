import React from "react";

const Map = ({ url }) => {
  return (
    <iframe
      id="mapFrame"
      src={url}
      style={{ display: "block" }}
      title="Map"
    ></iframe>
  );
};

export default Map;
