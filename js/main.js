let scene, camera, renderer, pointLight, gameId;
let balls = [];
let cubes = [];
let rocks = [];
let collisions = 0;
let rockTexture = new THREE.TextureLoader().load("../assets/rock.png");
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

document.body.appendChild(renderer.domElement);
camera.position.set(0, 0, 4);

pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(8, 10, 20);
scene.add(pointLight);

class Ball {
  constructor(radius, widthSegments, heightSegments) {
    this.colors = [
      "red",
      "gray",
      "violet",
      "green",
      "pink",
      "yellow",
      "orange",
      "aliceblue",
      "cornflowerblue",
      "darksalmon",
      "aquamarine",
    ];
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const material = new THREE.MeshLambertMaterial({
      color: this.colors[Math.ceil(Math.random() * 10)],
    });
    const ball = new THREE.Mesh(geometry, material);
    ball.position.set(0, 25, 1);
    scene.add(ball);
    this.ball = ball;
  }
}

class Cube {
  constructor(x, y, z, type) {
    this.colors = [
      "red",
      "gray",
      "violet",
      "green",
      "pink",
      "yellow",
      "orange",
      "aliceblue",
      "cornflowerblue",
      "darksalmon",
      "aquamarine",
    ];
    const cubeGeometry = new THREE.BoxGeometry(x, y, z);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: this.colors[Math.ceil(Math.random() * 10)],
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube = cube;
    const xaxis = Math.floor(Math.random() * (3 - 1) + 1);
    const yaxis = Math.floor(Math.random() * (3 - 1) + 1);
    if (type === "ONE") {
      this.cube.position.set(xaxis, yaxis, -10);
    } else if (type === "TWO") {
      this.cube.position.set(xaxis, -yaxis, -10);
    } else if (type === "THREE") {
      this.cube.position.set(-xaxis, -yaxis, -10);
    } else {
      this.cube.position.set(-xaxis, yaxis, -10);
    }
    scene.add(cube);
  }
}

function initiateBalls() {
  let ballInstance = new Ball(0.5, 32, 16);
  balls.push(ballInstance);
}

function bounce() {
  setTimeout(() => {
    balls[0].ball.position.set(0, 0, 0);
  });
}

function initiateCubes() {
  setInterval(() => {
    const types = ["ONE", "TWO", "THREE", "FOUR"];
    for (let i = 0; i < 5; i++) {
      let cube = new Cube(
        1,
        1,
        1,
        types[Math.floor(Math.random() * (3 - 0) + 1)]
      );
      cubes.push(cube);
    }
    moveBoxes();
  }, 3000);
}

function moveBoxes() {
  setInterval(() => {
    cubes.forEach((cube) => {
      cube.cube.position.z += 0.1;
      if (
        cube.cube.position.x === balls[0].ball.position.x &&
        cube.cube.position.y === balls[0].ball.position.y &&
        Math.ceil(cube.cube.position.z) === balls[0].ball.position.z
      ) {
        collisions += 1;
        // updateScore();
        const ret = scene.remove(cube.cube);
        // console.log(ret);
      }
    });
  }, 500);
}

function animate() {
  document.querySelector(".error").style.display = "none";
  gameId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // initiateCubes();
  if (collisions < 0) {
    document.querySelector(".error").style.display = "block";
    cancelAnimationFrame(gameId);
  }
}

function updateScore() {
  document.querySelector(".collisions").innerText = collisions;
}

function getRandom() {
  var num = Math.floor(Math.random() * 10) + 2;
  num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  return num;
}
function addTexture() {
  for (let i = 0; i < 200; i++) {
    let geometry = new THREE.PlaneGeometry(0.5, 0.5);
    let material = new THREE.MeshBasicMaterial({ map: rockTexture });
    let rock = new THREE.Mesh(geometry, material);
    rock.position.set(getRandom(), getRandom(), getRandom());
    rock.material.side = THREE.DoubleSide;
    rocks.push(rock);
  }

  for (let j = 0; j < rocks.length; j++) {
    scene.add(rocks[j]);
  }
}
function init() {
  addTexture();
  initiateBalls();
  bounce();
  initiateCubes();
  animate();
}

init();

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    balls[0].ball.position.x -= 1;
    balls[0].ball.rotation.x -= 5;
  } else if (e.key === "ArrowRight") {
    balls[0].ball.position.x += 1;
    balls[0].ball.rotation.x += 5;
  } else if (e.key === "ArrowUp") {
    balls[0].ball.position.y += 1;
    balls[0].ball.position.z -= 1;
    balls[0].ball.rotation.z += 5;
  } else if (e.key === "ArrowDown") {
    balls[0].ball.position.y -= 1;
    balls[0].ball.position.z += 1;
    balls[0].ball.rotation.z -= 5;
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById("restart").onclick = () => {
  init();
};
