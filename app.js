// Scene
let controller;
let slideScene;
let pageScene;
let fashionScene;

function animateSlides() {
  // init Controller
  controller = new ScrollMagic.Controller();
  // select some things
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelectorAll(".nav-header");
  // loop over
  sliders.forEach((slide, index, slides) => {
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
    // Create Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .setTween(slideTl)
      .addTo(controller);
    // new animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    // Create ne scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })
      // to make the slide section sticky - pushFollowers to avoid hugh section
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

//cursor animation and burger toggle
const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function cursor(event) {
  mouse.style.top = event.pageY + "px";
  mouse.style.left = event.pageX + "px";
}

function activeCursor(event) {
  const item = event.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseTxt.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    mouseTxt.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

function navToggle(event) {
  if (!event.target.classList.contains("active")) {
    event.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45deg", y: "5px", background: "black" });
    gsap.to(".line2", 0.5, {
      rotate: "-45deg",
      y: "-5px",
      background: "black",
    });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    document.body.classList.add("hide");
  } else {
    event.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: "0", background: "white" });
    gsap.to(".line2", 0.5, {
      rotate: "0",
      y: "0",
      background: "white",
    });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    document.body.classList.remove("hide");
  }
}

// Barba Page Transitions
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        fashionAnimation();
        gsap.fromTo(
          ".nav-header",
          1,
          { y: "100%" },
          { y: "0%", ease: "power2.inOut" }
        );
      },
      beforeLeave() {
        controller.destroy();
        fashionScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //an animation to fade out
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
        });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //scroll to the top
        window.scrollTo(0, 0);
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
        });
        tl.fromTo(
          ".swipe",
          1,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});

function fashionAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({
      defaults: { duration: 1 },
    });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
    // Scene
    fashionScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "fashion",
      })
      .addTo(controller);
  });
}

//Event listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
