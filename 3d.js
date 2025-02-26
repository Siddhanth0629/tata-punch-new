//Canvas Start
// Create Scene
gsap.registerPlugin(ScrollTrigger);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const rendererWidth = window.innerWidth;
const rendererHeight = window.innerHeight;

// Create WebGLRenderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
// Set the canvas size dynamically
renderer.setSize(rendererWidth, rendererHeight);

// Set tone mapping and encoding
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5; // Increase brightness
renderer.outputEncoding = THREE.sRGBEncoding;

// Append renderer's canvas to the #canvas-container div
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Add Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth rotation
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2; // Minimum zoom
controls.maxDistance = 10; // Maximum zoom

///////////////////////////////////////////////////////////////////////////////
// Load HDRI Environment
const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.load("./parkingLot2.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace; // Gamma correction
  scene.environment = texture;
  scene.background = texture;
});
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
let model;
// Load 3D Model
const loader = new THREE.GLTFLoader();
loader.load(
  "./car2.glb",
  function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 0);
    model.scale.set(2.1, 2.1, 2.1);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#canvas-container",
        // markers: true,
        scrub: 2,
        pin: true,
        start: "1% top",
        end: "+=4000px 95%",
        onEnter: () => {
          console.log("sdvv");
          document.querySelector(".overlay").style.position = "fixed";
        },
      },
    });

    tl.to(
      camera.position,
      {
        x: 0.02,
        y: 0.803,
        z: 0.54,
      },
      "one"
    )
      .to(
        camera.rotation,
        {
          x: 0.242,
          y: 3.142,
          z: -0.02,
        },
        "one"
      )
      .fromTo(".overlay", { opacity: 0 }, { opacity: 1 }, "one")
      .to(".card1", { opacity: 1 }, "one+=0.4")
      .to(
        camera.position,
        {
          x: -0.02,
          y: 0.451,
          z: 0.473,
        },
        "two"
      )
      .to(
        camera.rotation,
        {
          x: 0,
          y: 3.2,
          z: -0.034,
        },
        "two"
      )
      .to(".card1", { opacity: 0 }, "two")
      .to(".card2", { opacity: 1 }, "two+=0.4")
      .to(
        camera.position,
        {
          z: 0.4,
        },
        "a"
      )
      .to(".card2", { opacity: 0 }, "a")
      .to(
        camera.position,
        {
          x: 0.011,
          y: 0.297,
          z: 0.517,
        },
        "three"
      )
      .to(
        camera.rotation,
        {
          x: 0,
          y: 3.142,
          z: 0.01,
        },
        "three"
      )
      .to(".card3", { opacity: 1 }, "three+=0.4")
      .to(camera.position, {
        z: 0.5,
      })
      .to(
        camera.position,
        {
          x: -0.45,
          y: 0.7,
          z: 0.65,
        },
        "four"
      )
      .to(
        camera.rotation,
        {
          x: 0,
          y: 3.2,
          z: 0,
        },
        "four"
      )
      .to(".card3", { opacity: 0 }, "four")
      .to(".card4", { opacity: 1 }, "four+=0.4")
      .to(
        camera.position,
        {
          x: -0.033,
          y: 1.243,
          z: -0.781,
        },
        "five"
      )
      .to(
        camera.rotation,
        {
          x: -0.933,
          y: -0.034,
          z: 0,
        },
        "five"
      )
      .to(".card4", { opacity: 0 }, "five")
      .to(".card5", { opacity: 1 }, "five+=0.4")
      .to(".card5", { opacity: 0 });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("Error loading model:", error);
  }
);
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Set Camera Position
//Base Camera
camera.position.set(5, 1.5, 2);
camera.rotation.set(0, 1.2, 0);

//first animation
// camera.position.set(0.02, 0.85, 0.54);
// camera.rotation.set(0.4, 3.2, -0.02);

// camera.position.set(0.02, 0.803, 0.54);
// camera.rotation.set(0.242, 3.142, -0.02);

//second animation
// camera.position.set(-0.02, 0.42, 0.5);
// camera.rotation.set(0, 3.2, 0.01);

// camera.position.set(-0.02, 0.451, 0.473);
// camera.rotation.set(0, 3.2, -0.034);

//third animation
// camera.position.set(0.011, 0.297, 0.517);
// camera.rotation.set(0, 3.142, 0.01);

//fourth aniamtion
// camera.position.set(-0.45, 0.7, 0.65);
// camera.rotation.set(0, 3.2, 0);

//fifth aniamtion
// camera.position.set(-0.033, 1.243, -0.781);
// camera.rotation.set(-0.933, -0.034, 0);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  // controls.update(); // Required for damping effect
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Lights
const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.set(5, 2, 0);
scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
// scene.add(directionalLightHelper);
const axesHelper = new THREE.AxesHelper(1); // Size 1
directionalLight.add(axesHelper); // Attach AxesHelper to the light

const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color("white");
ambientLight.intensity = 0.4;
scene.add(ambientLight);
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Gui Helpers
// const gui = new dat.GUI();
// const cameraFolder = gui.addFolder("Camera Controls");
// // Control Camera Position
// cameraFolder.add(camera.position, "x", -1, 1).name("Position X").step(0.001);
// cameraFolder.add(camera.position, "y", -1, 2).name("Position Y").step(0.001);
// cameraFolder.add(camera.position, "z", -1, 1).name("Position Z").step(0.001);
// // Control Camera Rotation
// cameraFolder.add(camera.rotation, "x", -Math.PI, Math.PI).name("Rotation X").step(0.001);
// cameraFolder.add(camera.rotation, "y", -Math.PI, Math.PI).name("Rotation Y").step(0.001);
// cameraFolder.add(camera.rotation, "z", -Math.PI, Math.PI).name("Rotation Z").step(0.001);
// // Control Camera Field of View (FOV)
// cameraFolder
//   .add(camera, "fov", 1, 120)
//   .name("Field of View")
//   .onChange(() => {
//     camera.updateProjectionMatrix(); // Update camera after changing FOV
//   });
// cameraFolder.open(); // Open the Camera Controls by default
///////////////////////////////////////////////////////////////////////////////
//Canvas Ends
