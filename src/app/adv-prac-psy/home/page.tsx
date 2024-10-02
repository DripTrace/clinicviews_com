// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Image from "next/image";
// import Link from "next/link";
// import Lenis from "@studio-freight/lenis";

// gsap.registerPlugin(ScrollTrigger);

// const AdvancedPractice: React.FC = () => {
//     const mainRef = useRef<HTMLElement>(null);
//     const lenisRef = useRef<Lenis | null>(null);

//     useEffect(() => {
//         const init = async () => {
//             await Promise.all([preloadImages(), preloadFonts()]);
//             document.body.classList.remove("loading");

//             initSmoothScrolling();
//             initItems();
//             initAnimations();
//         };

//         init();

//         return () => {
//             if (lenisRef.current) {
//                 lenisRef.current.destroy();
//             }
//         };
//     }, []);

//     const preloadImages = (selector = ".deco__item") => {
//         return new Promise<void>((resolve) => {
//             const images = document.querySelectorAll(selector);
//             if (images.length === 0) {
//                 resolve();
//                 return;
//             }

//             let loadedCount = 0;
//             const checkAllLoaded = () => {
//                 loadedCount++;
//                 if (loadedCount === images.length) {
//                     resolve();
//                 }
//             };

//             images.forEach((img) => {
//                 if (img instanceof HTMLImageElement) {
//                     if (img.complete) {
//                         checkAllLoaded();
//                     } else {
//                         img.onload = checkAllLoaded;
//                     }
//                 } else {
//                     checkAllLoaded();
//                 }
//             });
//         });
//     };

//     const preloadFonts = () => {
//         return document.fonts.ready;
//     };

//     const initSmoothScrolling = () => {
//         lenisRef.current = new Lenis({
//             duration: 1.2,
//             easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//             smoothWheel: true,
//         });

//         const scrollFn = (time: number) => {
//             lenisRef.current?.raf(time);
//             requestAnimationFrame(scrollFn);
//         };

//         requestAnimationFrame(scrollFn);

//         lenisRef.current.on("scroll", ScrollTrigger.update);

//         gsap.ticker.add((time) => {
//             lenisRef.current?.raf(time * 1000);
//         });

//         gsap.ticker.lagSmoothing(0);
//     };

//     const initItems = () => {
//         const gtextElements =
//             mainRef.current?.querySelectorAll<HTMLDivElement>("[data-text]");
//         gtextElements?.forEach((el) => {
//             const text = el.getAttribute("data-text") || "";
//             const effect = el.getAttribute("data-effect");
//             let totalCells = 6;

//             if (effect === "1" || effect === "2" || effect === "3") {
//                 totalCells = 4;
//             } else if (effect === "4") {
//                 totalCells = 6;
//             }

//             let newHTML = "";
//             for (let i = 0; i < totalCells; ++i) {
//                 newHTML += `<span class="gtext__box"><span class="gtext__box-inner">${text}</span></span>`;
//             }

//             el.innerHTML = newHTML;

//             const inner =
//                 el.querySelectorAll<HTMLSpanElement>(".gtext__box-inner");
//             const computedWidth = window.getComputedStyle(inner[0]).width;
//             el.style.setProperty("--text-width", computedWidth);
//             el.style.setProperty("--gsplits", totalCells.toString());

//             const offset = parseFloat(computedWidth) / totalCells;
//             inner.forEach((innerEl, pos) => {
//                 gsap.set(innerEl, { left: -offset * pos });
//             });
//         });
//     };

//     const initAnimations = () => {
//         const items = mainRef.current?.querySelectorAll<HTMLDivElement>(
//             ".gtext[data-effect]"
//         );
//         const images =
//             mainRef.current?.querySelectorAll<HTMLDivElement>(".deco__item");

//         items?.forEach((item) => {
//             const effect = item.getAttribute("data-effect");
//             const itemInner =
//                 item.querySelectorAll<HTMLSpanElement>(".gtext__box-inner");
//             const itemInnerWrap =
//                 item.querySelectorAll<HTMLSpanElement>(".gtext__box");

//             switch (effect) {
//                 case "1":
//                     gsap.fromTo(
//                         itemInner,
//                         {
//                             xPercent: (index, _, targets) =>
//                                 index < targets.length / 2
//                                     ? -13 * index - 13
//                                     : 13 * (index - targets.length / 2) + 13,
//                         },
//                         {
//                             ease: "power1",
//                             xPercent: 0,
//                             scrollTrigger: {
//                                 trigger: item,
//                                 start: "top bottom",
//                                 end: "top top+=10%",
//                                 scrub: true,
//                             },
//                         }
//                     );
//                     break;
//                 case "2":
//                     gsap.timeline({
//                         defaults: { ease: "power1" },
//                         scrollTrigger: {
//                             trigger: item,
//                             start: "top bottom",
//                             end: "top top+=10%",
//                             scrub: true,
//                         },
//                     })
//                         .fromTo(
//                             itemInner,
//                             { xPercent: (index) => 30 * index },
//                             { xPercent: 0 },
//                             0
//                         )
//                         .fromTo(
//                             itemInnerWrap,
//                             { xPercent: (index) => 2 * (index + 1) * 10 },
//                             { xPercent: 0 },
//                             0
//                         );
//                     break;
//                 case "3":
//                     const intervalPixels = 100;
//                     const totalElements = itemInnerWrap.length;
//                     const totalWidth = (totalElements - 1) * intervalPixels;
//                     const offset = (totalWidth / 2) * -1;

//                     gsap.timeline({
//                         defaults: { ease: "power1" },
//                         scrollTrigger: {
//                             trigger: item,
//                             start: "top bottom",
//                             end: "top top+=10%",
//                             scrub: true,
//                         },
//                     })
//                         .fromTo(
//                             itemInner,
//                             {
//                                 xPercent: (index, _, targets) =>
//                                     index < targets.length / 2
//                                         ? -30 * index - 30
//                                         : 30 * (index - targets.length / 2) +
//                                           30,
//                                 yPercent: (index, _, targets) =>
//                                     index < targets.length / 2
//                                         ? 15 * (targets.length / 2 - index)
//                                         : 15 * (index + 1 - targets.length / 2),
//                             },
//                             {
//                                 xPercent: 0,
//                                 yPercent: 0,
//                             },
//                             0
//                         )
//                         .fromTo(
//                             itemInnerWrap,
//                             {
//                                 xPercent: (index) =>
//                                     index * intervalPixels + offset,
//                                 rotationZ: (index, _, targets) =>
//                                     index < targets.length / 2
//                                         ? -5 * (targets.length / 2 - index) - 5
//                                         : 5 * (index - targets.length / 2) + 5,
//                             },
//                             {
//                                 xPercent: 0,
//                                 rotationZ: 0,
//                             },
//                             0
//                         );
//                     break;
//                 case "4":
//                     gsap.timeline({
//                         defaults: { ease: "power1" },
//                         scrollTrigger: {
//                             trigger: item,
//                             start: "top bottom+=30%",
//                             end: "top top+=10%",
//                             scrub: true,
//                         },
//                     })
//                         .fromTo(
//                             itemInner,
//                             {
//                                 xPercent: (index, _, targets) =>
//                                     index < targets.length / 2
//                                         ? -50 * index - 50
//                                         : 50 * (index - targets.length / 2) +
//                                           50,
//                             },
//                             { xPercent: 0 },
//                             0
//                         )
//                         .fromTo(
//                             itemInner,
//                             {
//                                 scaleX: 1.5,
//                                 scaleY: 0,
//                                 transformOrigin: "50% 0%",
//                             },
//                             {
//                                 ease: "power2.inOut",
//                                 scaleX: 1,
//                                 scaleY: 1,
//                             },
//                             0
//                         )
//                         .fromTo(
//                             itemInnerWrap,
//                             {
//                                 xPercent: (index) =>
//                                     index * 100 -
//                                     (itemInnerWrap.length - 1) * 50,
//                             },
//                             {
//                                 xPercent: 0,
//                                 stagger: {
//                                     amount: 0.07,
//                                     from: "center",
//                                 },
//                             },
//                             0
//                         );
//                     break;
//                 case "5":
//                     gsap.timeline({
//                         defaults: { ease: "power1" },
//                         scrollTrigger: {
//                             trigger: item,
//                             start: "top bottom",
//                             end: "top top+=10%",
//                             scrub: true,
//                         },
//                     }).fromTo(
//                         itemInner,
//                         {
//                             xPercent: (index, _, targets) =>
//                                 index < targets.length / 2
//                                     ? -20 * index - 20
//                                     : 20 * (index - targets.length / 2) + 20,
//                             yPercent: (index) => (index % 2 === 0 ? -40 : 40),
//                         },
//                         {
//                             xPercent: 0,
//                             yPercent: 0,
//                         },
//                         0
//                     );
//                     break;
//                 case "6":
//                     gsap.timeline({
//                         scrollTrigger: {
//                             trigger: item,
//                             start: "top bottom",
//                             end: "top top",
//                             scrub: true,
//                         },
//                     })
//                         .fromTo(
//                             itemInner,
//                             {
//                                 xPercent: (index, _, targets) =>
//                                     (targets.length - index - 1) * -6 - 6,
//                             },
//                             {
//                                 ease: "power1",
//                                 xPercent: 0,
//                             },
//                             0
//                         )
//                         .fromTo(
//                             itemInnerWrap,
//                             {
//                                 yPercent: (index) => index * 20,
//                             },
//                             {
//                                 yPercent: 0,
//                             },
//                             0
//                         );
//                     break;
//                 default:
//                     gsap.fromTo(
//                         itemInner,
//                         {
//                             xPercent: (index, _, targets) =>
//                                 index < targets.length / 2
//                                     ? -10 * index - 10
//                                     : 10 * (index - targets.length / 2) + 10,
//                         },
//                         {
//                             ease: "power1",
//                             xPercent: 0,
//                             scrollTrigger: {
//                                 trigger: item,
//                                 start: "top bottom",
//                                 end: "top top+=10%",
//                                 scrub: true,
//                             },
//                         }
//                     );
//                     break;
//             }
//         });

//         images?.forEach((image) => {
//             gsap.fromTo(
//                 image,
//                 {
//                     transformOrigin: "800% 50%",
//                     rotationZ: -8,
//                 },
//                 {
//                     ease: "power1",
//                     rotationZ: 5,
//                     scrollTrigger: {
//                         trigger: image,
//                         start: "top bottom",
//                         end: "top top+=10%",
//                         scrub: true,
//                     },
//                 }
//             );
//         });
//     };

//     return (
//         <main ref={mainRef} className="main-container">
//             <header className="frame frame--header">
//                 <h1 className="frame__title">Advanced Practice</h1>
//                 <a className="frame__back" href="/">
//                     About Us
//                 </a>
//                 <a className="frame__prev" href="/">
//                     Contact
//                 </a>
//                 <a className="frame__sub" href="/">
//                     Services
//                 </a>
//             </header>

//             <div className="deco">
//                 {[...Array(18)].map((_, i) => (
//                     <div key={i} className="deco__item">
//                         <Image
//                             src={`/advanced-practice-psych/img/images/${i + 1}.jpg`}
//                             alt={`Decorative image ${i + 1}`}
//                             layout="fill"
//                             objectFit="cover"
//                         />
//                     </div>
//                 ))}
//             </div>

//             <div className="content">
//                 <p>
//                     At Advanced Practice,
//                     <br />
//                     We are committed to advancing the knowledge
//                     <br />
//                     of mental health professionals.
//                     <br />
//                     You'd enhance your skills through our curated programs
//                     <br />
//                     and deepen your understanding of psychiatric care.
//                 </p>

//                 <h2
//                     className="gtext size-s font-4 end"
//                     data-text="Enhance Your Practice"
//                 >
//                     Enhance Your Practice
//                 </h2>
//                 <h2
//                     className="gtext size-s font-4 end"
//                     data-text="Enhance Your Practice"
//                 >
//                     Enhance Your Practice
//                 </h2>
//             </div>

//             <div className="content content--full">
//                 <h3
//                     className="gtext size-xxl font-5 shadow-1 spaced"
//                     data-text="expertise"
//                     data-effect="1"
//                 >
//                     expertise
//                 </h3>
//             </div>

//             <div className="content">
//                 <p>
//                     For years, we have dedicated ourselves to helping
//                     <br />
//                     psychiatric professionals gain new insights and skills.
//                     <br />
//                     You'd grow your expertise through our evidence-based
//                     <br />
//                     learning modules and expand your knowledge of modern
//                     psychiatric practice.
//                 </p>

//                 <h2
//                     className="gtext size-s font-5 end"
//                     data-text="Expand Your Knowledge"
//                 >
//                     Expand Your Knowledge
//                 </h2>
//             </div>

//             <div className="content content--full">
//                 <h3
//                     className="gtext size-xl font-4 shadow-2 color-1 spaced"
//                     data-text="education"
//                     data-effect="2"
//                 >
//                     education
//                 </h3>
//             </div>

//             <div className="content">
//                 <p>
//                     Through quiet reflection and rigorous study,
//                     <br />
//                     You can elevate your psychiatric practice.
//                     <br />
//                     You'd find clarity through our well-structured courses
//                     <br />
//                     and feel empowered to bring new ideas into your work.
//                 </p>

//                 <h2
//                     className="gtext size-s font-1 end"
//                     data-text="Start Learning"
//                 >
//                     Start Learning
//                 </h2>
//                 <h2
//                     className="gtext size-s font-1 end"
//                     data-text="Start Learning"
//                 >
//                     Start Learning
//                 </h2>
//             </div>

//             <div className="content content--full">
//                 <h3
//                     className="gtext size-xl font-7 shadow-1 spaced"
//                     data-text="growth"
//                     data-effect="3"
//                 >
//                     growth
//                 </h3>
//             </div>

//             <div className="content content--full">
//                 <h2
//                     className="gtext size-m font-7 end"
//                     data-text="Continue Your Journey"
//                 >
//                     Continue Your Journey
//                 </h2>
//             </div>

//             <div className="content">
//                 <p>
//                     In a world of ever-evolving mental health challenges,
//                     <br />
//                     We stand ready to help you stay informed.
//                     <br />
//                     You'd stay updated on the latest research and techniques
//                     <br />
//                     and bring fresh approaches to your practice.
//                 </p>
//             </div>

//             <div className="content content--full">
//                 <h3
//                     className="gtext size-xl font-2 shadow-2 color-1 blendmode-1 spaced"
//                     data-text="innovation"
//                     data-effect="4"
//                 >
//                     innovation
//                 </h3>
//             </div>

//             <div className="content content--full">
//                 <h2
//                     className="gtext size-m font-4 end"
//                     data-text="Embrace New Knowledge"
//                 >
//                     Embrace New Knowledge
//                 </h2>
//             </div>

//             <div className="content">
//                 <p>
//                     With the right educational resources,
//                     <br />
//                     Even the most complex psychiatric challenges can be met.
//                     <br />
//                     You'd discover new possibilities through our training
//                     programs
//                     <br />
//                     and explore innovations that lead to improved patient care.
//                 </p>

//                 <h2
//                     className="gtext size-s font-1 end"
//                     data-text="Lead the Change"
//                 >
//                     Lead the Change
//                 </h2>
//             </div>

//             <div className="content content--full">
//                 <h3
//                     className="gtext size-xxl font-6 shadow-1 spaced"
//                     data-text="professionalism"
//                     data-effect="5"
//                 >
//                     professionalism
//                 </h3>

//                 <p>
//                     As you grow in your career,
//                     <br />
//                     You'd feel empowered to make a lasting impact in psychiatric
//                     care.
//                     <br />
//                     Our programs are designed to enhance your professional
//                     journey,
//                     <br />
//                     fostering confidence and competence.
//                 </p>
//             </div>

//             <div className="content">
//                 <h2
//                     className="gtext size-s font-1 end"
//                     data-text="Take the Next Step"
//                 >
//                     Take the Next Step
//                 </h2>
//             </div>

//             <div className="content content--full">
//                 <h3
//                     className="gtext size-xl font-3 shadow-1 spaced"
//                     data-text="clarity"
//                     data-effect="6"
//                 >
//                     clarity
//                 </h3>

//                 <p>
//                     Our mission at Advanced Practice
//                     <br />
//                     is to guide you through every step of your professional
//                     journey.
//                     <br />
//                     You'd gain clarity and confidence as you evolve as a
//                     psychiatric practitioner,
//                     <br />
//                     and embrace the knowledge that will help you thrive.
//                 </p>
//             </div>

//             <footer className="frame frame--footer">
//                 <span>
//                     <Link href="https://www.instagram.com/advancedpractice/">
//                         @advancedpractice
//                     </Link>
//                 </span>
//                 <Link href="https://www.youtube.com/@AdvanCEdpractice-io/videos">
//                     Subscribe
//                 </Link>
//             </footer>
//         </main>
//     );
// };

// export default AdvancedPractice;

export default {};
