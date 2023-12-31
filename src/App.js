import { useState, useEffect } from 'react'
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
function App() {

  // More API functions here:
  // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

  // the link to your model provided by Teachable Machine export panel
  const URL = "/my_model/";

  let model, maxPredictions;

  const [detectedType, setDetectedType] = useState("")
  const [webcam, setWebcam] = useState(new tmImage.Webcam(400, 400, true))

  // Load the image model and setup the webcam
  useEffect(() => {
    init()
  }, []);

  async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    //const flip = true; // whether to flip the webcam
    //webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
  }

  async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
  }

  // run the webcam image through the image model
  async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      if (prediction[0].probability.toFixed(2) >= 0.80) {
        setDetectedType("Blød plastik");
      } else if (prediction[1].probability.toFixed(2) >= 0.80) {
        setDetectedType("Plastik flaske");

      } else if (prediction[2].probability.toFixed(2) >= 0.80) {
        setDetectedType("Mobil telefon");
      } else if (prediction[3].probability.toFixed(2) >= 0.80) {
        setDetectedType("Briller");
      } else if (prediction[4].probability.toFixed(2) >= 0.80) {
        setDetectedType("Dåse");
      } else if (prediction[5].probability.toFixed(2) >= 0.80) {
        setDetectedType("");
      }
    }
  }

  return (
    <div>
      <div id="webcam-container"></div>
      <div id="label-container">
        <p>{detectedType}</p>
      </div>
    </div>
  );
}

export default App;
