// ---- SAVE P5 CANVAS SNAPSHOT AS PNG
// -----------------------------------
let countSaved = 1;
function saveSnapshot(
  sk,
  defaultDensity,
  densityFactor = 2,
  filename = "sketch"
) {
  const currentDensity = sk.pixelDensity();
  sk.pixelDensity(defaultDensity * densityFactor);
  sk.redraw();
  sk.saveCanvas(`${filename}${countSaved}`, "png");
  countSaved++;
  sk.pixelDensity(currentDensity);
  sk.redraw();
}

// ---- SINOIDAL PULSE
// -------------------
function pulse(sk, min, max, time) {
  const mid = (min + max) / 2;
  const amplitude = (max - min) / 2;
  return amplitude * sk.sin(sk.frameCount * (sk.TWO_PI / time)) + mid;
}

// ---- ADJUST VIDEO DIMENSIONS FOR RESPONSIVE FULL SCREEN VIDEO
// -------------------------------------------------------------
// USAGE:
// const videoDimensions = calculateVideoDimensions(sk, myVideo);
// sk.image(myVideo, videoDimensions.x, videoDimensions.y, videoDimensions.w, videoDimensions.h);

function calculateVideoDimensions(sk, video) {
  let canvasRatio = sk.width / sk.height;
  let videoRatio = video.width / video.height;
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

  return { x, y, w, h };
}

export { calculateVideoDimensions, saveSnapshot };
