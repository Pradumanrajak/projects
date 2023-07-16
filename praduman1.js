const express = require('express');
const bodyParser = require('body-parser');
const turf = require('@turf/turf');
const fs = require('fs');

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Custom authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authentication header is present and has the expected format
  // Modify this logic to implement your authentication logic
  // Example: Check if the header value is "Bearer TOKEN"
  const expectedAuth = 'Bearer TOKEN';
  if (authHeader !== expectedAuth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

// Sample set of 50 lines
const lines = [
  { id: 'L01', start: [0, 0], end: [1, 1] },
  { id: 'L02', start: [2, 2], end: [3, 3] },
  // Add more lines here...
];

// POST endpoint for finding intersecting lines
app.post('/json.js', authenticate, (req, res) => {
  // Read the JSON file
  fs.readFile('C:\Users\admin\praduman1\project1\json.js', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read the JSON file' });
    }

    let linestring;
    try {
      // Parse the JSON file content
      const jsonData = JSON.parse(data);

      // Extract the linestring from the JSON data
      if (!jsonData || !jsonData.linestring || !jsonData.linestring.coordinates) {
        return res.status(400).json({ error: 'Invalid JSON file content' });
      }

      linestring = jsonData.linestring;
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON file format' });
    }

    // Create a feature from the linestring
    const feature = turf.lineString(linestring.coordinates);

    // Array to store intersecting line ids and points of intersection
    const intersections = [];

    // Check for intersections with each line
    for (const line of lines) {
      const lineFeature = turf.lineString([line.start, line.end]);
      const intersection = turf.lineIntersect(feature, lineFeature);

      if (intersection.features.length > 0) {
        intersections.push({
          id: line.id,
          point: intersection.features[0].geometry.coordinates
        });
      }
    }

    // Return the result
    if (intersections.length === 0) {
      res.json([]);
    } else {
      res.json(intersections);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
