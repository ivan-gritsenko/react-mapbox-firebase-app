import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGl, { Marker } from "react-map-gl";
import { useEffect, useState } from "react";
import app from "../config/firebase";
import { getDatabase, ref, get, push, set, remove } from "firebase/database";
import "./MapBox.css";

const TOKEN =
  "pk.eyJ1Ijoic3hta2FpIiwiYSI6ImNseWU5dnE3dzAwOXYybnNkcmFhZTZkMzEifQ.NO80-DI2wF2cRIJhstsEwg";

interface Place {
  lat: number;
  long: number;
}

export const MapBox = () => {
  const [markers, setMarkers] = useState([] as Place[]);
  const [viewPort, setViewPort] = useState({
    latitude: 48.531,
    longitude: 31.894,
    zoom: 5.65,
  });

  const fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "mapbox/markers");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      setMarkers(Object.values(snapshot.val()));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDoubleClick = (e: any) => {
    e.preventDefault();

    const { lng, lat } = e.lngLat;

    const db = getDatabase(app);
    const newDocRef = push(ref(db, "mapbox/markers"));
    set(newDocRef, {
      lat: lat,
      long: lng,
      timestamp: Date.now(),
    })
      .then(() => {
        setMarkers([...markers, { lat, long: lng }]);
      })
      .catch((error) => {
        alert(error);
      });
  };

  function zoomToCurrentPlace(curPlace: Place) {
    console.log(curPlace);
    if (curPlace) {
      setViewPort({
        ...viewPort,
        latitude: curPlace.lat,
        longitude: curPlace.long,
        zoom: 9,
      });
    }
  }

  const handleDeleteAll = () => {
    const db = getDatabase(app);
    remove(ref(db, "mapbox/markers"))
      .then(() => {
        alert("data deleted");
        setMarkers([]);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div style={{ height: "100vh" }}>
      <h1
        className="App"
        style={{ margin: "10px", padding: "0", fontSize: "24px" }}
      >
        React + Firebase + MapBox
      </h1>
      <div style={{ display: "flex", padding: "10px 10%", gap: "10px" }}>
        {" "}
        {!!markers.length && (
          <div className="custom-select">
            <select
              name="markers"
              onChange={(e) => {
                zoomToCurrentPlace(JSON.parse(e.target.value));
              }}
            >
              {markers.map((marker, index) => (
                <option key={index} value={JSON.stringify(marker)}>
                  {`Marker ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
        <button className="button" onClick={handleDeleteAll}>
          Delete All
        </button>
      </div>

      <ReactMapGl
        mapStyle="mapbox://styles/mapbox/streets-v9"
        {...viewPort}
        mapboxAccessToken={TOKEN}
        onMove={(viewPort: any) => setViewPort(viewPort)}
        onDblClick={handleDoubleClick}
        style={{
          height: "80%",
          width: "80%",
          margin: "auto",
          border: "2px solid black",
          borderRadius: "10px",
        }}
      >
        {!!markers.length && (
          <>
            {markers.map((marker, index) => (
              <Marker
                key={index}
                latitude={marker?.lat}
                longitude={marker?.long}
                offsetLeft={-20}
                offsetTop={-30}
              >
                <img
                  src="https://static-00.iconduck.com/assets.00/map-marker-icon-342x512-gd1hf1rz.png"
                  alt="marker"
                  style={{ width: 32, height: 44 }}
                />
              </Marker>
            ))}
          </>
        )}
      </ReactMapGl>
    </div>
  );
};
