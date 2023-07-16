
const turf = require('@turf/turf');
const axios = require('axios');

const coordinates = [
  [-2.45848, 2.008567],   // Point 1
  [-1.36568, 1.07666],    // Point 2
  // Add more coordinates as needed
];

for (let i = 0; i < 48; i++) {
  const randomCoordinate = turf.randomPosition([-180, -90, 180, 90]);
  coordinates.push(randomCoordinate);
}

const requestBody = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: coordinates,
  },
};

(axios.post('http://localhost:3001/praduman1.js', requestBody))
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
