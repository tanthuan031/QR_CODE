// import React, { useEffect, useState } from 'react';
// function Location() {
//   const [location1, setLocation1] = useState(null);
//   const [location2, setLocation2] = useState(null);
//   const [distance, setDistance] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState({});

//   var map = L.map('map').setView([10.7587603, 106.6124299], 12);
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data © OpenStreetMap contributors',
//   }).addTo(map);
//   console.log('ss', map);
//   function getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//       alert('Geolocation is not supported by this browser.');
//     }
//   }

//   function showPosition(position) {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;
//     console.log('Latitude: ' + latitude + ' Longitude: ' + longitude);
//     setCurrentLocation({
//       latitude: latitude,
//       longitude: longitude,
//     });
//   }

//   return (
//     <div className="App">
//       <h1>Calculate Distance</h1>
//       <button onClick={getLocation}>Set Location 1</button>
//       {/* <button onClick={handleLocation2}>Set Location 2</button>
//       <button onClick={scale}>Scale</button> */}

//       {
//         <p>
//           Vi tri A: {currentLocation.latitude} - {currentLocation.longitude}
//         </p>
//       }
//       {<p>Vi tri B: {location2} </p>}
//       {distance && <p>Distance: {distance} meters</p>}
//     </div>
//   );
// }

// export default Location;
