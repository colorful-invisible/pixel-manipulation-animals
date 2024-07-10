import p5 from "p5";
import videoURL from "../assets/videos/beetle_03.mp4";
import { calculateVideoDimensions } from "./utils";

new p5((sk) => {
  let animalVideo;
  let videoDimensions;

  sk.preload = () => {
    animalVideo = sk.createVideo(videoURL);
  };

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    animalVideo.loop();
    animalVideo.hide();
    animalVideo.elt.addEventListener("loadedmetadata", () => {
      videoDimensions = calculateVideoDimensions(sk, animalVideo);
    });
  };

  sk.draw = () => {
    sk.background(0);
    if (videoDimensions) {
      sk.image(
        animalVideo,
        videoDimensions.x,
        videoDimensions.y,
        videoDimensions.w,
        videoDimensions.h
      );
    }

    // sk.fill(0, 0, 100, 50);
    // sk.noStroke();
    // sk.ellipse(sk.mouseX, sk.mouseY, 50, 50);
  };

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    if (animalVideo.width) {
      videoDimensions = calculateVideoDimensions(sk, animalVideo);
    }
  };
});
