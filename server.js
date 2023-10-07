import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';
import isUri from "valid_url"


// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get("/filteredimage", async (req, res) => {
  const { image_url: imageUrl } = req.query;
  if (!imageUrl || !isUri(imageUrl)) {
    return res.status(400).send({ code: "400", message: 'Image url is missing or malformed' });
  }

  try {
    const filteredPath = await filterImageFromURL(imageUrl);
    res.sendFile(filteredPath, {}, () => deleteLocalFiles([filteredPath]));
  }
  catch (e) {
    res.status(500).send({ code: "500", message: 'Internal Server Error' });
  }
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});


// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
