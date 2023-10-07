import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';


// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get("/filteredimage", async (req, res, next) => {
  let imageUrl = req.query.image_url

  try {
    let url = await filterImageFromURL(imageUrl)
    res.sendFile(url, (e) => {
      deleteLocalFiles(Array.of(url))
    })
  } catch (error) {
    next(error)
  }
});

app.get("/", async (req, res) => {
  res.send("GET")
});

const errorHandler = (error, request, response, next) => {
  const status = error.status || 422
  response.status(status).send(error.message)
}
app.use(errorHandler)

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
