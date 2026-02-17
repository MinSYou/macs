let values = [];
let w = 12;
let osc;
let started = false;
let isMuted = false;
let muteBtn;

function setup() {
  createCanvas(windowWidth, 500);
  colorMode(HSB, height, 100, 100);

  generateValues();

  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();

  // Start Button
  let startBtn = createButton('Start Loop');
  startBtn.position(20, 20);
  startBtn.mousePressed(() => {
    if (!started) {
      userStartAudio();
      startBtn.hide();
      started = true;
      startInfiniteLoop(); // Kick off the loop
    }
  });

  // Mute Toggle Button
  muteBtn = createButton('Mute');
  muteBtn.position(20, 50);
  muteBtn.mousePressed(toggleMute);
}

function generateValues() {
  values = [];
  for (let i = 0; i < width / w; i++) {
    values.push(random(height));
  }
}

async function startInfiniteLoop() {
  while (true) {
    await bubbleSort(values);
    
    // Wait for 5 seconds after finishing a sort
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Reset and randomize for the next round
    generateValues();
  }
}

async function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // We still "visit" every comparison for the visual
      await swap(arr, j, j + 1);
    }
  }
}

async function swap(arr, a, b) {
  // Play tone if sound is on, regardless of if they swap
  // (Makes the audio feedback more consistent during the "scan")
  if (arr[a] > arr[b]) {
    if (!isMuted) playTone(arr[a]);

    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;

    // Control the speed of the sort here (20ms)
    await new Promise(resolve => setTimeout(resolve, 20));
  }
}

function playTone(val) {
  let freq = map(val, 0, height, 120, 200);
  osc.freq(freq, 0.1);
  osc.amp(0.2, 0.1);
  
  setTimeout(() => {
    osc.amp(0, 0.1);
  }, 50);
}

function toggleMute() {
  isMuted = !isMuted;
  muteBtn.html(isMuted ? 'Unmute' : 'Mute');
  if (isMuted) {
    osc.amp(0, 0.1); // Immediately silence if muting
  }
}

function draw() {
  background(235, 25, 15); 

  for (let i = 0; i < values.length; i++) {
    noStroke();
    fill(values[i], 80, 90); 
    rect(i * w, height - values[i], w - 2, values[i]);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 500);
}
