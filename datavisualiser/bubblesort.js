// https://editor.p5js.org/
// Bubble Sort Data Visualiser running off of Javascript

let values = [];
let w = 12;
let osc;
let started = false;

function setup() {
  createCanvas(windowWidth, 500);
  colorMode(HSB, height, 100, 100);

  for (let i = 0; i < width / w; i++) {
    values.push(random(height));
  }

  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();

  let btn = createButton('Start Sorting');
  btn.position(20, 20);
  btn.mousePressed(() => {
    if (!started) {
      userStartAudio();
      bubbleSort(values);
      started = true;
      btn.hide();
    }
  });
}

async function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      await swap(arr, j, j + 1);
    }
  }
}

async function swap(arr, a, b) {
  if (arr[a] > arr[b]) {
    playTone(arr[a]);

    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;

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
