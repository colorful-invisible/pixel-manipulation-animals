import p5 from "p5";
import videoURL from "../assets/videos/beetle_02.mp4";
import { calculateVideoDimensions, saveSnapshot } from "./utils";

new p5((sk) => {
  let animalVideo;
  let videoDimensions;
  let defaultDensity;
  let videoReady = false;

  sk.preload = () => {
    animalVideo = sk.createVideo(videoURL);
    animalVideo.elt.muted = true; // Mute the video
    animalVideo.elt.playsInline = true; // Allow inline playback on iOS
  };

  function attemptAutoplay() {
    let playPromise = animalVideo.elt.play();

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          // Autoplay started
          animalVideo.loop();
        })
        .catch((error) => {
          // Autoplay was prevented
          console.warn("Autoplay was prevented:", error);
          // You might want to add a subtle play button here as a fallback
        });
    }
  }

  sk.setup = () => {
    defaultDensity = sk.displayDensity();
    sk.pixelDensity(defaultDensity);
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    animalVideo.hide();
    animalVideo.elt.addEventListener("loadedmetadata", () => {
      videoDimensions = calculateVideoDimensions(sk, animalVideo);
      videoReady = true;
      attemptAutoplay();
    });
  };

  sk.draw = () => {
    sk.background(0);
    if (videoDimensions && videoReady) {
      sk.image(
        animalVideo,
        videoDimensions.x,
        videoDimensions.y,
        videoDimensions.w,
        videoDimensions.h
      );
    }
  };

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    if (animalVideo.width) {
      videoDimensions = calculateVideoDimensions(sk, animalVideo);
    }
  };

  sk.keyPressed = () => {
    if (sk.key === "s" || sk.key === "S") {
      saveSnapshot(sk, defaultDensity, 2, "sketch");
    }
  };

  // Add this to attempt autoplay on any user interaction with the page
  sk.mousePressed = sk.touchStarted = () => {
    if (!animalVideo.elt.playing) {
      attemptAutoplay();
    }
  };
});
