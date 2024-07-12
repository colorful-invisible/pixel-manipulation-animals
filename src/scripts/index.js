import p5 from "p5";
import videoURL from "../assets/videos/beetle_03.mp4";
import fontURL from "../assets/fonts/molitor.otf";
import { calculateVideoDimensions, saveSnapshot, pulse } from "./utils";

new p5((sk) => {
  let animalVideo;
  let videoDimensions;
  let typeface;
  let defaultDensity;
  let cellSize = 16;

  function createEllipsis(x, y, size) {
    return {
      draw: function (fillColor, strokeColor, pulseSize = 1) {
        sk.push();
        sk.fill(fillColor);
        sk.stroke(strokeColor);
        sk.strokeWeight(1);
        sk.ellipse(x, y, size * pulseSize, size * pulseSize);
        sk.pop();
      },
    };
  }

  function createRect(x, y, size) {
    return {
      draw: function (fillColor, strokeColor, pulseSize = 1) {
        sk.push();
        sk.fill(fillColor);
        sk.stroke(strokeColor);
        sk.strokeWeight(2);
        sk.rect(x, y, size * pulseSize, size * pulseSize);
        sk.pop();
      },
    };
  }

  sk.preload = () => {
    animalVideo = sk.createVideo(videoURL);
    animalVideo.elt.muted = true;
    animalVideo.elt.playsInline = true;

    typeface = sk.loadFont(fontURL);
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
    sk.textAlign(sk.CENTER, sk.CENTER);
    sk.textFont(typeface);
  };

  sk.draw = () => {
    sk.background(255);
    // sk.background(27, 160, 131, 80);

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

          let pixelElement = createRect(posX, posY, cellSize);
          // let pulseSize = pulse(sk, 0.8, 1, 6);

          if (brightness < 10) {
            pixelElement.draw(
              sk.color(0, 0, 0, 0),
              sk.color(0, 0, 0, 0)
              // pulseSize
            );
          } else if (brightness < 90) {
            pixelElement.draw(
              sk.color(27, 160, 131),
              sk.color("black")
              // pulseSize
            );
            sk.push();
            sk.noStroke();
            sk.fill(0, 0, 0, 200);
            sk.triangle(
              posX + cellSize,
              posY,
              posX + cellSize,
              posY + cellSize,
              posX,
              posY + cellSize
            );
            sk.pop();
          } else if (brightness < 125) {
            pixelElement.draw(
              sk.color(24, 121, 153),
              sk.color("black")
              // pulseSize
            );
            sk.push();
            sk.noStroke();
            sk.fill(0, 0, 0, 200);
            sk.triangle(
              posX + cellSize,
              posY,
              posX + cellSize,
              posY + cellSize,
              posX,
              posY + cellSize
            );
            sk.pop();
          } else if (brightness < 160) {
            pixelElement.draw(
              sk.color(245, 89, 9),
              sk.color("black")
              // pulseSize
            );
          } else {
            pixelElement.draw(
              sk.color(247, 217, 0),
              sk.color("black")
              // pulseSize
            );
            sk.push();
            sk.noStroke();
            sk.fill(0);
            sk.ellipse(posX + cellSize / 2, posY + cellSize / 2, 4, 4);
            sk.pop();
          }
        }
      }
    }

    sk.push();
    // sk.blendMode(sk.DIFFERENCE);
    sk.fill("black");
    sk.textSize(sk.width * 0.04);
    sk.text("FROM NOTHINGNESS", sk.width / 2, (sk.height / 4) * 3);
    sk.pop();

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
