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
      document.body.style.overflowX = "hidden";
    });
  //Landing Page Ends
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //Scroll Section Starts
  document.querySelectorAll(".section").forEach((sectionElement, index, sections) => {
    // Check if it's the last section
    if (index === sections.length - 1) {
      return; // Skip the last section
    }

    const containerElement = sectionElement.querySelector(".container");
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
    wheelMultiplier: 0.4, // Scroll speed
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
          const zIncrement = progress * 33500;
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
