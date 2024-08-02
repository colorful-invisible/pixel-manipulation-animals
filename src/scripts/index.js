import p5 from "p5";
import videoURL from "../assets/videos/beetle_03.mp4";
import fontURL from "../assets/fonts/molitor.otf";
import { calculateVideoDimensions, saveSnapshot, pulse } from "./utils";

// TO DO: REDUCE PROCESSING OF DARK PIXELS AVOIDING THEM TO BE IN THE ARRAY.
new p5((sk) => {
  let animalVideo;
  let videoDimensions;
  let typeface;
  let defaultDensity;
  let cellSize = 16;
  let pixels = [];
  let repulsionRadius = 60;
  let maxRepulsion = 180;

  class Pixel {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.originalX = x;
      this.originalY = y;
      this.size = size;
      this.velocity = { x: 0, y: 0 };
    }

    draw(fillColor, strokeColor) {
      sk.push();
      sk.fill(fillColor);
      sk.stroke(strokeColor);
      sk.strokeWeight(2);
      sk.rect(this.x, this.y, this.size, this.size);
      sk.pop();
    }

    repulse(mouseX, mouseY) {
      let dx = this.x - mouseX;
      let dy = this.y - mouseY;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < repulsionRadius) {
        let normalizedDistance = distance / repulsionRadius;
        let force = Math.pow(1 - normalizedDistance, 2) * maxRepulsion;

        this.velocity.x += (dx / distance) * force;
        this.velocity.y += (dy / distance) * force;
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      this.velocity.x *= 0.9;
      this.velocity.y *= 0.9;

      let returnForce = 0.05;
      this.x += (this.originalX - this.x) * returnForce;
      this.y += (this.originalY - this.y) * returnForce;
    }
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
      createPixels();
    });

    animalVideo.show = false;
    sk.textAlign(sk.CENTER, sk.CENTER);
    sk.textFont(typeface);
  };

  function createPixels() {
    pixels = [];
    animalVideo.loadPixels();
    for (let y = 0; y < videoDimensions.h; y += cellSize) {
      for (let x = 0; x < videoDimensions.w; x += cellSize) {
        let videoX = sk.map(x, 0, videoDimensions.w, 0, animalVideo.width);
        let videoY = sk.map(y, 0, videoDimensions.h, 0, animalVideo.height);

        let pixelIndex =
          (sk.floor(videoX) + sk.floor(videoY) * animalVideo.width) * 4;
        let brightness =
          (animalVideo.pixels[pixelIndex] +
            animalVideo.pixels[pixelIndex + 1] +
            animalVideo.pixels[pixelIndex + 2]) /
          3;

        let posX = videoDimensions.x + x;
        let posY = videoDimensions.y + y;
        pixels.push(new Pixel(posX, posY, cellSize, brightness));
      }
    }
  }

  sk.draw = () => {
    sk.background(247, 217, 0);

    console.log(pixels.length);

    if (videoDimensions) {
      animalVideo.loadPixels();

      pixels.forEach((pixel) => {
        let videoX = sk.map(
          pixel.originalX - videoDimensions.x,
          0,
          videoDimensions.w,
          0,
          animalVideo.width
        );
        let videoY = sk.map(
          pixel.originalY - videoDimensions.y,
          0,
          videoDimensions.h,
          0,
          animalVideo.height
        );

        let pixelIndex =
          (sk.floor(videoX) + sk.floor(videoY) * animalVideo.width) * 4;
        pixel.brightness =
          (animalVideo.pixels[pixelIndex] +
            animalVideo.pixels[pixelIndex + 1] +
            animalVideo.pixels[pixelIndex + 2]) /
          3;

        pixel.repulse(sk.mouseX, sk.mouseY);

        if (pixel.brightness < 10) {
          return;
        } else if (pixel.brightness < 90) {
          pixel.draw(sk.color(27, 160, 131), sk.color("black"));
          drawTriangle(pixel, sk.color(0, 0, 0, 180));
        } else if (pixel.brightness < 125) {
          pixel.draw(sk.color(24, 121, 153), sk.color("black"));
          drawTriangle(pixel, sk.color(0, 0, 0, 180));
        } else if (pixel.brightness < 160) {
          pixel.draw(sk.color(245, 89, 9), sk.color("black"));
        } else {
          pixel.draw(sk.color(247, 217, 0), sk.color("black"));
          drawDot(pixel);
        }
      });
    }

    // sk.push();
    // sk.fill("black");
    // sk.textSize(sk.width * 0.04);
    // sk.text("FROM NOTHINGNESS", sk.width / 2, (sk.height / 4) * 3);
    // sk.pop();

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

  function drawTriangle(pixel, color) {
    sk.push();
    sk.noStroke();
    sk.fill(color);
    sk.triangle(
      pixel.x + cellSize,
      pixel.y,
      pixel.x + cellSize,
      pixel.y + cellSize,
      pixel.x,
      pixel.y + cellSize
    );
    sk.pop();
  }

  function drawDot(pixel) {
    sk.push();
    sk.noStroke();
    sk.fill(0);
    sk.ellipse(pixel.x + cellSize / 2, pixel.y + cellSize / 2, 4, 4);
    sk.pop();
  }

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    if (animalVideo.width) {
      videoDimensions = calculateVideoDimensions(sk, animalVideo);
      createPixels();
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
