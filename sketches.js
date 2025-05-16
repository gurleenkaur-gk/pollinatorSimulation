let pollinators = [];
let plants = [];
let plantImgs = [];
let plantImgFiles = [
  "appletree.PNG",
  "blueberrybush.PNG",
  "coneflower.PNG",
  "fuschiaflower.PNG",
  "guavatree.PNG",
  "hibiscusbush.PNG",
  "mustardflower.PNG",
  "zinniaflower.PNG"
];
let tooltip;
let bgImg; // Add this line
const bottomMargin = 60;

// Ensure tooltip div exists and is styled
window.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('tooltip')) {
    const div = document.createElement('div');
    div.id = 'tooltip';
    div.className = 'hidden';
    div.style.position = 'absolute';
    div.style.background = 'rgba(255,255,255,0.8)'; // Make the textbox partially transparent
    div.style.border = '1px solid #888';
    div.style.padding = '8px 12px';
    div.style.borderRadius = '8px';
    div.style.pointerEvents = 'none';
    div.style.fontSize = '16px';
    div.style.fontFamily = 'monospace, Arial, sans-serif'; // Explicitly set fantasy font with fallbacks
    div.style.zIndex = '1000';
    document.body.appendChild(div);
  }
  // Add .hidden style if not present
  if (!document.getElementById('tooltip-style')) {
    const style = document.createElement('style');
    style.id = 'tooltip-style';
    style.innerHTML = `.hidden { display: none !important; }`;
    document.head.appendChild(style);
  }
});

function preload() {
  bgImg = loadImage('images/pixelbg.jpg');
  // Load plant images using actual filenames
  for (let fname of plantImgFiles) {
    plantImgs.push(loadImage(`images/plants/${fname}`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  tooltip = document.getElementById("tooltip");

  let grassyTop = height * 0.8;
  let grassyHeight = height - grassyTop;
  let maxAttempts = 100;

  // Separate plant indices by type
  let treeIndices = [];
  let otherIndices = [];
  for (let i = 0; i < plantImgFiles.length; i++) {
    if (plantImgFiles[i].includes("tree")) {
      treeIndices.push(i);
    } else {
      otherIndices.push(i);
    }
  }

  let allIndices = [...treeIndices, ...otherIndices];
  let numPlants = allIndices.length;
  let spacing = width / (numPlants + 1);

  for (let i = 0; i < allIndices.length; i++) {
    const idx = allIndices[i];
    const fname = plantImgFiles[idx];
    const size = getPlantSize(fname);
    const x = spacing * (i + 1);
    const y = height - 100;
    const name = fname.replace(".PNG", "");

    // Update fun facts based on plant name
    let funFact = "";
    if (name.includes("blueberry")) {
      funFact = "Blueberries rely heavily on buzz pollination, a technique where bees (especially bumblebees) vibrate their flight muscles to shake loose the pollen, which is otherwise trapped inside the flower’s anthers. Honeybees can’t perform buzz pollination, so native bees are crucial for blueberry farms!";
    } else if (name.includes("zinnia")) {
      funFact = "Zinnias are a butterfly magnet thanks to their bright colors and easily accessible flat-topped blooms, which provide the perfect landing pad. Butterflies like monarchs and swallowtails flock to them, and the flowers benefit from their pollen transfer between blooms.";
    } else if (name.includes("coneflower")) {
      funFact = "Coneflowers offer abundant nectar and have a raised cone center, allowing butterflies to perch while feeding. Their long bloom season ensures that butterflies have a reliable food source throughout the summer.";
    } else if (name.includes("hibiscus")) {
      funFact = "Hibiscus flowers are trumpet-shaped, a design that’s perfect for hummingbirds’ long, slender beaks and tongues. As hummingbirds drink the nectar, their foreheads brush the flower’s anthers, helping pollinate the plant with each visit.";
    } else if (name.includes("fuschia")) {
      funFact = "Fuchsia flowers hang downward, which discourages insects and favors hummingbirds, who hover below and reach up into the tubular blooms. The vibrant pinks and purples of fuchsia are also colors that hummingbirds are especially drawn to.";
    } else if (name.includes("mustard")) {
      funFact = "Wild mustard often blooms in cooler temperatures when bees are less active, so flies step in as primary pollinators. The plant’s small, open yellow flowers make it easy for flies (especially syrphid or hoverflies) to access pollen and nectar, making them surprisingly effective pollinators in early spring and fall.";
    } else if (name.includes("appletree")) {
      funFact = "Apple trees can’t self-pollinate effectively — they need pollen from a different apple variety, and bees play a vital role in carrying that pollen between trees. One honeybee can visit up to 5,000 apple blossoms a day, dramatically improving fruit yield.";
    } else if (name.includes("guavatree")) {
      funFact = "Guava flowers are fragrant and rich in pollen, attracting both bees and hoverflies. While bees help with pollination during the day, flies often step in during early morning or overcast weather, making guava trees unusually resilient and well-pollinated across different conditions.";
    }

    // Update pollinators based on plant name
    let pollinators = [];
    if (name.includes("blueberry")) {
      pollinators = ["Bee"];
    } else if (name.includes("zinnia") || name.includes("coneflower")) {
      pollinators = ["Butterfly"];
    } else if (name.includes("hibiscus") || name.includes("fuschia")) {
      pollinators = ["Hummingbird"];
    } else if (name.includes("mustard")) {
      pollinators = ["Fly"];
    } else if (name.includes("appletree")) {
      pollinators = ["Bee"];
    } else if (name.includes("guavatree")) {
      pollinators = ["Bee", "Fly"];
    }

    plants.push(new Plant(
      x, y, plantImgs[idx],
      pollinators, // Update pollinators dynamically
      funFact,
      size,
      name
    ));
  }

  // Update pollinator creation to use specific images
  const pollinatorImages = {
    Bee: loadImage("images/pollinators/bee.PNG"),
    Butterfly: loadImage("images/pollinators/butterfly.PNG"),
    Fly: loadImage("images/pollinators/fly.PNG"),
    Hummingbird: loadImage("images/pollinators/hummingbird.PNG")
  };

  // Create 5 of each pollinator type
  for (let type in pollinatorImages) {
    for (let i = 0; i < 5; i++) {
      pollinators.push(new Pollinator(pollinatorImages[type], type));
    }
  }
}

function draw() {
  if (bgImg) {
    image(bgImg, 0, 0, width, height); // Draw background image stretched to canvas
  } else {
    background(240);
  }

  // Show plants
  for (let plant of plants) {
    plant.display();
  }

  // Update and show pollinators
  for (let i = pollinators.length - 1; i >= 0; i--) {
    let pollinator = pollinators[i];
    pollinator.update();
    pollinator.display();
    if (pollinator.state === "leaving" && pollinator.isOffScreenRight()) {
      // Remove and respawn a new bee from the left
      pollinators.splice(i, 1);
      pollinators.push(new Pollinator(pollinator.img));
    }
  }

  // Tooltip logic
  let hovering = false;
  for (let plant of plants) {
    if (plant.isMouseHovering()) {
      showTooltip(plant);
      hovering = true;
      break;
    }
  }

  if (!hovering) tooltip.classList.add("hidden");
}

// ----- Classes -----

class Pollinator {
  constructor(img, type) {
    this.size = 48; // Increased size of pollinators
    this.img = img;
    this.type = type; // Add type to identify pollinator
    this.reset();
  }

  reset() {
    this.pos = createVector(-this.size, random(height * 0.4));
    this.vel = createVector(1.5, 0);
    this.landed = false;
    this.target = null;
    this.bobblePhase = random(TWO_PI);
    this.landedTime = 0;
    this.state = "flying";
  }

  update() {
    if (this.state === "flying") {
      this.bobblePhase += 0.15 + random(-0.01, 0.01);
      this.pos.add(this.vel);
      this._wrapVertically();
      // Only target a plant if not already targeting and random chance
      if (!this.target && random() < 0.001) {
        let validPlants = plants.filter(plant => plant.pollinators.includes(this.type));
        if (validPlants.length > 0) {
          let plant = random(validPlants);
          this.target = createVector(plant.x, plant.y - plant.size / 2 - 20); // Adjust target to top part of the plant
          this.state = "landing";
        }
      }
    } else if (this.state === "landing") {
      this.bobblePhase += 0.15 + random(-0.01, 0.01);
      // Ensure p5.Vector is correctly referenced
      let dir = createVector(this.target.x - this.pos.x, this.target.y - this.pos.y);
      let distToTarget = dir.mag();
      if (distToTarget < 2) {
        this.pos = this.target.copy();
        this.state = "landed";
        this.landedTime = millis();
      } else {
        dir.setMag(1.5);
        this.pos.add(dir);
      }
    } else if (this.state === "landed") {
      // Stay on plant for 2 seconds, then leave
      if (millis() - this.landedTime > 2000) {
        this.state = "leaving";
        this.vel = createVector(2.5, 0); // Move right
      }
    } else if (this.state === "leaving") {
      this.pos.add(this.vel);
      this._wrapVertically();
    }
  }

  display() {
    let bobbleY = 0, bobbleX = 0;
    if (this.state === "flying" || this.state === "landing") {
      bobbleY = sin(this.bobblePhase) * 6;
      bobbleX = cos(this.bobblePhase * 0.7) * 3;
    }

    push();
    translate(this.pos.x + bobbleX, this.pos.y + bobbleY);
    if (this.vel.x > 0) {
      scale(-1, 1); // Flip image horizontally when moving right
    }
    imageMode(CENTER);
    image(this.img, 0, 0, this.size, this.size);
    pop();
  }

  isOffScreenRight() {
    return this.pos.x - this.size > width;
  }

  _wrapVertically() {
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }
}

class Plant {
  constructor(x, y, img, pollinators, funFact, size = 80, name = "Plant") {
    this.x = x;
    this.y = y;
    this.img = img;
    this.pollinators = pollinators;
    this.funFact = funFact;
    this.size = size;
    this.name = name;
  }

  display() {
    if (this.img) {
      push();
      imageMode(CENTER);
      image(this.img, this.x, this.y - this.size / 2, this.size, this.size);
      // Remove bounding box
      pop();
    } else {
      fill(34, 139, 34);
      ellipse(this.x, this.y, this.size);
    }
  }

  isMouseHovering() {
    // Use bounding box for hover detection if image exists, otherwise use circle
    if (this.img) {
      // Check if mouse is within the image rectangle
      return (
        mouseX >= this.x - this.size / 2 &&
        mouseX <= this.x + this.size / 2 &&
        mouseY >= this.y - this.size &&
        mouseY <= this.y
      );
    } else {
      return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
    }
  }
}

// ----- Tooltip -----

function showTooltip(plant) {
  tooltip.classList.remove("hidden");
  tooltip.innerHTML = `
    <strong>Pollinators:</strong> ${plant.pollinators.join(', ')}<br>
    <strong>Fun Fact:</strong> ${plant.funFact}<br>
    <strong>Plant Name:</strong> ${plant.name}<br>
  `;
  tooltip.style.left = `${mouseX + 10}px`;
  tooltip.style.top = `${mouseY + 10}px`;
  console.log(plant);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function getPlantSize(filename) {
  if (filename.includes("tree")) return 400;
  if (filename.includes("bush")) return 300;
  if (filename.includes("flower")) return 200;
  return 80;
}