import fs from "fs";
import Jimp from "jimp";
import axios from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  // link to issue on github and solution => https://github.com/oliver-moran/jimp/issues/775
  try {
    const { data: imageBuffer } = await axios({
      method: 'get',
      url: inputURL,
      responseType: 'arraybuffer'
    });

    const photo = await Jimp.read(imageBuffer);
    const outpath = `/tmp/filtered.${Math.floor(Math.random() * 2000)}.jpg`;
    const path = __dirname + outpath;
    const photoResult = await photo
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .writeAsync(path);
    return path;
  } catch (error) {
    throw new Error("Filter Image Error!");
  }
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}