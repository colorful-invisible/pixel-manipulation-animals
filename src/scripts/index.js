import p5 from "p5";
import videoURL from "../assets/videos/beetle_03.mp4";

new p5((sk) => {
  let animalVideo;
  let videoReady = false;

  sk.preload = () => {
    animalVideo = sk.createVideo(videoURL, () => {
      console.log("Video is ready!");
      videoReady = true;
      animalVideo.volume(0);
      animalVideo.loop();
    });
    animalVideo.hide();
  };

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
  };

  sk.draw = () => {
    sk.background(0); // Black background to fill any gaps
    if (videoReady && animalVideo.loadedmetadata) {
      displayVideoFullScreen();
    } else {
      sk.fill(255);
      sk.textSize(24);
      sk.textAlign(sk.CENTER, sk.CENTER);
      sk.text("Click to start video", sk.width / 2, sk.height / 2);
    }

    // Your existing drawing code
    sk.fill(0, 0, 100);
    sk.noStroke();
    sk.ellipse(10, 10, 100);
  };

  function displayVideoFullScreen() {
    let vidW = animalVideo.width;
    let vidH = animalVideo.height;
    let canvasRatio = sk.width / sk.height;
    let videoRatio = vidW / vidH;
    let x = 0;
    let y = 0;
    let w = sk.width;
    let h = sk.height;

    if (canvasRatio > videoRatio) {
      // Canvas is wider than video
      h = sk.width / videoRatio;
      y = (sk.height - h) / 2;
    } else {
      // Canvas is taller than video
      w = sk.height * videoRatio;
      x = (sk.width - w) / 2;
    }

    sk.image(animalVideo, x, y, w, h);
  }

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
  };
});
