import p5 from "p5";
import videoURL from "../assets/videos/beetle_02.mp4";
import { calculateVideoDimensions, saveSnapshot } from "./utils";

new p5((sk) => {
  let animalVideo;
  let videoDimensions;

  let cellSize = 10;

  let defaultDensity;

  sk.preload = () => {
    animalVideo = sk.createVideo(videoURL);
    animalVideo.elt.muted = true;
    animalVideo.elt.playsInline = true;
  };

  sk.setup = () => {
    defaultDensity = sk.displayDensity();
    sk.createCanvas(sk.windowWidth, sk.windowHeight);

    animalVideo.hide();
    animalVideo.elt.willReadFrequently = true;
    animalVideo.elt.addEventListener("loadedmetadata", () => {
      videoDimensions = calculateVideoDimensions(sk, animalVideo);
      animalVideo.loop();
    });

    animalVideo.show = false;
  };

  sk.draw = () => {
    // sk.background("aqua");
    sk.background(255, 255, 255, 120);

    if (videoDimensions) {
      animalVideo.loadPixels();

      for (let y = 0; y < videoDimensions.h; y += cellSize) {
        for (let x = 0; x < videoDimensions.w; x += cellSize) {
          // Map canvas coordinates to video coordinates
          let videoX = sk.map(x, 0, videoDimensions.w, 0, animalVideo.width);
          let videoY = sk.map(y, 0, videoDimensions.h, 0, animalVideo.height);

          let index =
            (sk.floor(videoX) + sk.floor(videoY) * animalVideo.width) * 4;
          let r = animalVideo.pixels[index + 0];
          let g = animalVideo.pixels[index + 1];
          let b = animalVideo.pixels[index + 2];
          let brightness = (r + g + b) / 3;

          let posX = videoDimensions.x + x + cellSize / 2;
          let posY = videoDimensions.y + y + cellSize / 2;

          let colorFill;
          let colorStroke;

          if (brightness < 20) {
            colorFill = sk.color(0, 0, 0, 0);
            colorStroke = sk.color(0, 0, 0, 0);
          } else if (brightness >= 20 && brightness < 120) {
            colorFill = sk.color("tomato");
            colorStroke = sk.color(0, 0, 0, 255);
          } else if (brightness >= 120 && brightness < 160) {
            colorFill = sk.color("aquamarine");
            colorStroke = sk.color(0, 0, 0, 0);
          } else {
            colorFill = sk.color("yellow");
            colorStroke = sk.color(0, 0, 0, 255);
          }

          sk.push();
          sk.fill(colorFill);
          sk.stroke(colorStroke);
          sk.ellipse(posX, posY, cellSize - 2, cellSize - 2);
          sk.pop();
        }
      }
    }

    if (animalVideo.show) {
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
      saveSnapshot(sk, defaultDensity, 4);
    }

    if (sk.key === "h") {
      animalVideo.show = !animalVideo.show;
    }
  };
});
