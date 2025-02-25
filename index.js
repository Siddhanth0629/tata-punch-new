document.addEventListener("DOMContentLoaded", (event) => {
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //Landing Page Starts
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(Observer);

  CustomEase.create("hop", "M0,0 C0.355,0.022 0.488,0.079 0.5,0.5 0.542,0.846 0.615,1,1,1");

  CustomEase.create("hop2", "M0,0 C0.078,0.617 0.114,0.716 0.255,0.828 0.373,0.922 0.561,1,1,1");

  const splitH2 = new SplitType(".site-info h2", {
    types: "lines",
  });

  splitH2.lines.forEach((line) => {
    const text = line.textContent;
    const wrapper = document.createElement("div");
    wrapper.className = "line";
    const span = document.createElement("span");
    span.textContent = text;
    wrapper.appendChild(span);
    line.parentNode.replaceChild(wrapper, line);
  });

  const mainTl = gsap.timeline();
  const revealerTl = gsap.timeline();
  const scaleTl = gsap.timeline();

  revealerTl
    .to(".r-1", {
      clipPath: "polygon(0% 0%,100% 0%,100% 0%,0% 0%)",
      duration: 1.5,
      ease: "hop",
    })
    .to(
      ".r-2",
      {
        clipPath: "polygon(0% 100%,100% 100%,100% 100%,0% 100%)",
        duration: 1.5,
        ease: "hop",
      },
      "<"
    );

  scaleTl.to(".img:first-child", {
    scale: 1,
    duration: 2,
    ease: "power.inOut",
  });

  const images = document.querySelectorAll(".img:not(:first-child)");

  images.forEach((img, index) => {
    scaleTl.to(
      img,
      {
        opacity: 1,
        scale: 1,
        duration: 1.25,
        ease: "power3.out",
      },
      ">-0.7"
    );
  });

  mainTl
    .add(revealerTl)
    .add(scaleTl, "-=1.25")
    .add(() => {
      document.querySelectorAll(".img:not(.main)").forEach((img) => img.remove());
      const state = Flip.getState(".main");
      const imagesContainer = document.querySelector(".images");
      imagesContainer.classList.add("stacked-container");

      document.querySelectorAll(".main").forEach((img, i) => {
        img.classList.add("stacked");
        img.style.order = i;
        gsap.set(".img.stacked", {
          clearProps: "transform,top,left",
        });
      });

      return Flip.from(state, {
        duration: 2,
        ease: "hop",
        absolute: true,
        stagger: {
          amount: -0.3,
        },
      });
    })
    .to(".word h1,.nav-item p,.line p,.site-info h2 .line span", {
      y: 0,
      duration: 3,
      ease: "hop2",
      stagger: 0.1,
      delay: 1,
    })
    .to(".cover-img", {
      clipPath: "polygon(0% 100%,100% 100%,100% 0%,0% 0%)",
      duration: 2,
      ease: "hop",
      delay: -1,
    })
    .eventCallback("onStart", () => {
      document.body.style.overflow = "hidden";
    })
    .eventCallback("onComplete", () => {
      document.body.style.overflow = "";
    });
  //Landing Page Ends
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  //Scroll Section Starts
  document.querySelectorAll(".sectionVerticalScroll").forEach((sectionElement, index, sections) => {
    // Check if it's the last section
    if (index === sections.length - 1) {
      return; // Skip the last section
    }

    const containerElement = sectionElement.querySelector(".scroll-container");
    const nextSectionElement = sectionElement.parentNode.querySelector(
      `section:nth-child(${index + 2})`
    );

    gsap
      .timeline({
        scrollTrigger: {
          trigger: sectionElement,
          start: `center (nextSectionElement.offsetTop - (window.innerHeight * 0.5))`,
          end: `bottom 20%`,
          scrub: 1,
          pin: true,
          pinSpacing: false,
          // markers: true,
        },
      })
      .to(containerElement, {
        opacity: 0,
        scale: 0.8,
        yPercent: 30,
        duration: 3,
        ease: "power1.out",
      });
  });
  //Scroll Section Ends
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //Lenis Starts
  const lenis = new Lenis({
    duration: 1.2, // Adjusts smoothness (higher = smoother)
    smooth: true,
    wheelMultiplier: 0.8, // Scroll speed
    ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
  });

  // Animation loop to update Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Optionally listen for scroll events
  window.addEventListener("scroll", () => {
    lenis.scroll;
  });
  //Lenis Ends
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  //Canvas Start
  // Create Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Create WebGLRenderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // Set the canvas size dynamically
  renderer.setSize(window.innerWidth, window.innerHeight);

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
            // document.querySelector(".overlay").style.position = "fixed";
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

  //Gallery Section Start
  setTimeout(() => {
    const slides = gsap.utils.toArray(".slide");
    const activeSlidesImages = gsap.utils.toArray(".active-slide img");

    function getInitialTranslateZ(slide) {
      const style = window.getComputedStyle(slide);
      const matrix = style.transform.match(/matrix3d\((.+)\)/);
      if (matrix) {
        const values = matrix[1].split(", ");
        return parseFloat(values[14] || 0);
      }
      return 0;
    }

    function mapRange(value, inMin, inMax, outMin, outMax) {
      return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    slides.forEach((slide, index) => {
      const initialZ = getInitialTranslateZ(slide);
      ScrollTrigger.create({
        trigger: ".galleryContainer",
        start: "top top",
        bottom: "bottom bottom",
        scrub: true,
        markers: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const zIncrement = progress * 52500;
          const currentZ = initialZ + zIncrement;

          let opacity;

          if (currentZ > -2500) {
            opacity = mapRange(currentZ, -2500, 0, 0.5, 1);
          } else {
            opacity = mapRange(currentZ, -5000, -2500, 0, 0.5);
          }

          slide.style.opacity = opacity;
          slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`;

          if (currentZ < 100) {
            gsap.to(activeSlidesImages[index], 1.5, {
              opacity: 1,
              ease: "power3.out",
            });
          } else {
            gsap.to(activeSlidesImages[index], 1.5, {
              opacity: 0,
              ease: "power3.out",
            });
          }
        },
        onEnter: () => {
          document.querySelector(".active-slide").style.position = "fixed";
          document.querySelector(".active-slide img").style.position = "absolute";
          document.querySelector(".slider").style.position = "fixed";
          document.querySelector(".slide").style.position = "absolute";
        },
        onLeaveBack: () => {
          document.querySelector(".active-slide").style.position = "absolute";
          document.querySelector(".active-slide img").style.position = "absolute";
          document.querySelector(".slider").style.position = "absolute";
          document.querySelector(".slide").style.position = "absolute";
        },
      });
    });
  }, 2000);
  //Gallery Section Ends
});
