let controller;
let slideScene;

function animateSlides() {
  // init Controller
  controller = new ScrollMagic.Controller();
  // select some things
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelectorAll(".nav-header");
  // loop over
  sliders.forEach((slide) => {
    const img = slide.querySelector("img");
    const revealImg = slide.querySelector(".reveal-img");
    const revealText = slide.querySelector(".reveal-text");
    // GSAP (SELECT, time, object with the property you want change)
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    //animate 1s sooner as defaults "-=1"
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.75");
  });
}

animateSlides();
