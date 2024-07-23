import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const LottieScrollSection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Load Lottie animation
    const animation = lottie.loadAnimation({
      container: animationRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '/assets/techstack.json'
    });

    let interactiveElements = [];
    let hoverTimelines = [];
    let isScrollAnimationComplete = false;

    animation.addEventListener('DOMLoaded', () => {
      // Define key frames for different parts of the animation
      const keyFrames = [
        {
          clipPath: '54',
          start: 0,
          scrollEnd: 130,
          hoverStart: 200,
          hoverEnd: 249
        },
        {
          clipPath: '13',
          start: 0,
          scrollEnd: 130,
          hoverStart: 131,
          hoverEnd: 166
        },
        {
          clipPath: '482',
          start: 0,
          scrollEnd: 130,
          hoverStart: 290,
          hoverEnd: 334
        }
      ];

      // Set initial frame
      animation.goToAndStop(keyFrames[0].start, true);

      // Create scroll animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%", // Increase this value to extend the pinning duration
        pin: containerRef.current,
        anticipatePin: 1,
        scrub: true,
        onUpdate: (self) => {
          const frame = gsap.utils.interpolate(keyFrames[0].start, keyFrames[0].scrollEnd, self.progress);
          animation.goToAndStop(frame, true);

          // Check if scroll animation is complete
          if (self.progress === 1 && !isScrollAnimationComplete) {
            isScrollAnimationComplete = true;
            enableHoverAnimations();
          }
        }
      });

      // Get the SVG element
      const svg = animationRef.current.querySelector('svg');
      
      // Find the elements with clip-paths and create timelines
      keyFrames.forEach((kf, index) => {
        const element = svg.querySelector(`g[clip-path="url(#__lottie_element_${kf.clipPath})"]`);
        if (element) {
          interactiveElements.push(element);

          // Create hover animation timeline for each element
          const timeline = gsap.timeline({ paused: true })
            .to({}, {
              duration: 0.5,
              onUpdate: () => {
                const frame = gsap.utils.interpolate(kf.hoverStart, kf.hoverEnd, timeline.progress());
                animation.goToAndStop(frame, true);
              },
              onReverseComplete: () => {
                animation.goToAndStop(kf.scrollEnd, true);
              }
            });
          hoverTimelines.push(timeline);

          // Initially disable hover animation
          disableHoverAnimation(element);
        } else {
          console.log(`Interactive element ${kf.clipPath} not found`);
        }
      });
    });

    function enableHoverAnimations() {
      interactiveElements.forEach((element, index) => {
        if (element) {
          element.style.cursor = 'pointer';
          element.addEventListener('mouseenter', () => onMouseEnter(index));
          element.addEventListener('mouseleave', () => onMouseLeave(index));
        }
      });
    }

    function disableHoverAnimation(element) {
      if (element) {
        element.style.cursor = 'default';
        element.removeEventListener('mouseenter', onMouseEnter);
        element.removeEventListener('mouseleave', onMouseLeave);
      }
    }

    function onMouseEnter(index) {
      if (isScrollAnimationComplete) {
        hoverTimelines[index].play();
      }
    }

    function onMouseLeave(index) {
      if (isScrollAnimationComplete) {
        hoverTimelines[index].reverse();
      }
    }

    // Cleanup function
    return () => {
      lenis.destroy();
      animation.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="lottie-section">
      <div ref={containerRef} className="lottie-container">
        <div ref={animationRef} className="lottie-animation"></div>
      </div>
    </div>
  );
};

export default LottieScrollSection;