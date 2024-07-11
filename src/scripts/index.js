import p5 from "p5";
import videoURL from "../assets/videos/beetle_02.mp4";
import { calculateVideoDimensions, saveSnapshot, pulse } from "./utils";

new p5((sk) => {
  let animalVideo;
  let videoDimensions;
  let defaultDensity;
  let cellSize = 10;

  function createEllipsis(x, y, size) {
    return {
      draw: function (fillColor, strokeColor, pulseSize = 1) {
        sk.push();
        sk.fill(fillColor);
        sk.stroke(strokeColor);
        sk.ellipse(x, y, size * pulseSize, size * pulseSize);
        sk.pop();
      },
    };
  }

  sk.preload = () => {
    animalVideo = sk.createVideo(videoURL);
    animalVideo.elt.muted = true;
    animalVideo.elt.playsInline = true;
  };

  sk.setup = () => {
    defaultDensity = sk.displayDensity();
    sk.createCanvas(sk.windowWidth, sk.windowHeight);

    animalVideo.hide();
    animalVideo.elt.addEventListener("loadedmetadata", () => {
      videoDimensions = calculateVideoDimensions(sk, animalVideo);
      animalVideo.loop();
    });

    animalVideo.show = false;
  };

  sk.draw = () => {
    sk.background(255);

    if (videoDimensions) {
      animalVideo.loadPixels();

      for (let y = 0; y < videoDimensions.h; y += cellSize) {
        for (let x = 0; x < videoDimensions.w; x += cellSize) {
          let videoX = sk.map(x, 0, videoDimensions.w, 0, animalVideo.width);
          let videoY = sk.map(y, 0, videoDimensions.h, 0, animalVideo.height);

          let index =
            (sk.floor(videoX) + sk.floor(videoY) * animalVideo.width) * 4;
          let brightness =
            (animalVideo.pixels[index] +
              animalVideo.pixels[index + 1] +
              animalVideo.pixels[index + 2]) /
            3;

          let posX = videoDimensions.x + x + cellSize / 2;
          let posY = videoDimensions.y + y + cellSize / 2;

          let ellipsis = createEllipsis(posX, posY, cellSize);

          if (brightness < 20) {
            ellipsis.draw(sk.color(0, 0, 0, 0), sk.color(0, 0, 0, 0));
          } else if (brightness < 120) {
            // let pulseSize = pulse(sk, 1, 3, 2);
            ellipsis.draw(sk.color("tomato"), sk.color(0, 0, 0, 255));
          } else if (brightness < 160) {
            // let pulseSize = pulse(sk, 1, 2.5, 0.75);
            ellipsis.draw(sk.color("aquamarine"), sk.color(0, 0, 0, 0));
          } else {
            let pulseSize = pulse(sk, 0, 2, 0.5);
            ellipsis.draw(
              sk.color("yellow"),
              sk.color(0, 0, 0, 255),
              pulseSize
            );
          }
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
