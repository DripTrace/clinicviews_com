// AdvancedPractice.tsx
// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
// import imagesLoaded from "imagesloaded";
// import Lenis from "@studio-freight/lenis";
// import APItem from "@/components/AdvancedPracticePsych/APItem";
// import Link from "next/link";
// import ErrorBoundary from "@/components/AdvancedPracticePsych/ErrorBoundary";

// gsap.registerPlugin(ScrollTrigger);

// const AdvancedPractice: React.FC = () => {
//     const mainRef = useRef<HTMLElement>(null);
//     const lenisRef = useRef<Lenis | null>(null);

//     useEffect(() => {
//         const init = async () => {
//             await Promise.all([preloadImages(".deco__item"), preloadFonts()]);
//             document.body.classList.remove("loading");

//             initSmoothScrolling();
//             initAnimations();
//         };

//         init();

//         return () => {
//             if (lenisRef.current) {
//                 lenisRef.current.destroy();
//             }
//             ScrollTrigger.killAll();
//         };
//     }, []);

//     const preloadImages = (selector = ".deco__item") => {
//         return new Promise<void>((resolve) => {
//             imagesLoaded(
//                 document.querySelectorAll(selector),
//                 { background: true },
//                 () => resolve()
//             );
//         });
//     };

//     const preloadFonts = () => {
//         return new Promise<void>((resolve) => {
//             document.fonts.ready.then(() => resolve());
//         });
//     };

//     const initSmoothScrolling = () => {
//         lenisRef.current = new Lenis({
//             duration: 1.2,
//             easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//             smoothWheel: true,
//             // smoothTouch: false,
//         });

//         const lenisRAF = (time: number) => {
//             lenisRef.current?.raf(time);
//             requestAnimationFrame(lenisRAF);
//         };

//         requestAnimationFrame(lenisRAF);

//         lenisRef.current.on("scroll", ScrollTrigger.update);

//         ScrollTrigger.scrollerProxy(document.body, {
//             scrollTop(value) {
//                 if (arguments.length) {
//                     lenisRef.current?.scrollTo(value ?? 0, { immediate: true });
//                 }
//                 return lenisRef.current?.scroll || 0;
//             },
//             getBoundingClientRect() {
//                 return {
//                     top: 0,
//                     left: 0,
//                     width: window.innerWidth,
//                     height: window.innerHeight,
//                 };
//             },
//             pinType: document.body.style.transform ? "transform" : "fixed",
//         });

//         ScrollTrigger.addEventListener("refresh", () =>
//             (lenisRef.current as any)?.update()
//         );

//         ScrollTrigger.refresh();
//     };

//     const initAnimations = () => {
//         if (!mainRef.current) return;

//         const gtextElements =
//             mainRef.current.querySelectorAll<HTMLDivElement>("[data-text]");
//         gtextElements.forEach((el) => {
//             const text = el.getAttribute("data-text") || "";
//             const effect = el.getAttribute("data-effect") || "0";
//             const totalCells =
//                 parseInt(effect, 10) >= 1 && parseInt(effect, 10) <= 6 ? 4 : 6;

//             let newHTML = "";
//             for (let i = 0; i < totalCells; i++) {
//                 newHTML += `<span class="gtext__box"><span class="gtext__box-inner">${text}</span></span>`;
//             }

//             el.innerHTML = newHTML;

//             const innerElements =
//                 el.querySelectorAll<HTMLSpanElement>(".gtext__box-inner");
//             const computedWidth = window.getComputedStyle(
//                 innerElements[0]
//             ).width;
//             el.style.setProperty("--text-width", computedWidth);
//             el.style.setProperty("--gsplits", totalCells.toString());

//             const offset = parseFloat(computedWidth) / totalCells;
//             innerElements.forEach((innerEl, pos) => {
//                 gsap.set(innerEl, { left: -offset * pos });
//             });
//         });

//         const items = mainRef.current.querySelectorAll<HTMLDivElement>(
//             ".gtext[data-effect]"
//         );
//         const images =
//             mainRef.current.querySelectorAll<HTMLDivElement>(".deco__item");

//         items.forEach((item) => {
//             const effect = item.getAttribute("data-effect") || "0";
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
//                                     ? -130 * index - 130
//                                     : 130 * (index - targets.length / 2) + 130,
//                         },
//                         {
//                             xPercent: 0,
//                             ease: "power1",
//                             scrollTrigger: {
//                                 trigger: item,
//                                 scroller: document.body,
//                                 start: "top bottom",
//                                 end: "top top+=10%",
//                                 scrub: true,
//                             },
//                         }
//                     );
//                     break;
//                 case "2":
//                     gsap.timeline({
//                         scrollTrigger: {
//                             trigger: item,
//                             scroller: document.body,
//                             start: "top bottom",
//                             end: "top top+=10%",
//                             scrub: true,
//                         },
//                     })
//                         .fromTo(
//                             itemInner,
//                             { xPercent: (index) => 300 * index },
//                             { xPercent: 0 }
//                         )
//                         .fromTo(
//                             itemInnerWrap,
//                             { xPercent: (index) => 200 * (index + 1) },
//                             { xPercent: 0 },
//                             0
//                         );
//                     break;
//                 case "3":
//                     gsap.timeline({
//                         scrollTrigger: {
//                             trigger: item,
//                             scroller: document.body,
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
//                                         ? -300 * index - 300
//                                         : 300 * (index - targets.length / 2) +
//                                           300,
//                                 yPercent: (index, _, targets) =>
//                                     index < targets.length / 2
//                                         ? 150 * (targets.length / 2 - index)
//                                         : 150 *
//                                           (index + 1 - targets.length / 2),
//                             },
//                             {
//                                 xPercent: 0,
//                                 yPercent: 0,
//                             }
//                         )
//                         .fromTo(
//                             itemInnerWrap,
//                             {
//                                 xPercent: (index) =>
//                                     index * 1000 -
//                                     (itemInnerWrap.length - 1) * 500,
//                                 rotationZ: (index, _, targets) =>
//                                     index < targets.length / 2
//                                         ? -50 * (targets.length / 2 - index) -
//                                           50
//                                         : 50 * (index - targets.length / 2) +
//                                           50,
//                             },
//                             {
//                                 xPercent: 0,
//                                 rotationZ: 0,
//                             }
//                         );
//                     break;
//                 case "4":
//                     gsap.timeline({
//                         scrollTrigger: {
//                             trigger: item,
//                             scroller: document.body,
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
//                                         ? -500 * index - 500
//                                         : 500 * (index - targets.length / 2) +
//                                           500,
//                             },
//                             {
//                                 xPercent: 0,
//                             }
//                         )
//                         .fromTo(
//                             itemInner,
//                             {
//                                 scaleX: 3,
//                                 scaleY: 0,
//                                 transformOrigin: "50% 0%",
//                             },
//                             {
//                                 scaleX: 1,
//                                 scaleY: 1,
//                                 ease: "power2.inOut",
//                             }
//                         )
//                         .fromTo(
//                             itemInnerWrap,
//                             {
//                                 xPercent: (index) =>
//                                     index * 1000 -
//                                     (itemInnerWrap.length - 1) * 500,
//                             },
//                             {
//                                 xPercent: 0,
//                                 stagger: {
//                                     amount: 0.07,
//                                     from: "center",
//                                 },
//                             }
//                         );
//                     break;
//                 case "5":
//                     gsap.timeline({
//                         scrollTrigger: {
//                             trigger: item,
//                             scroller: document.body,
//                             start: "top bottom",
//                             end: "top top+=10%",
//                             scrub: true,
//                         },
//                     }).fromTo(
//                         itemInner,
//                         {
//                             xPercent: (index, _, targets) =>
//                                 index < targets.length / 2
//                                     ? -200 * index - 200
//                                     : 200 * (index - targets.length / 2) + 200,
//                             yPercent: (index) => (index % 2 === 0 ? -400 : 400),
//                         },
//                         {
//                             xPercent: 0,
//                             yPercent: 0,
//                         }
//                     );
//                     break;
//                 case "6":
//                     gsap.timeline({
//                         scrollTrigger: {
//                             trigger: item,
//                             scroller: document.body,
//                             start: "top bottom",
//                             end: "top top",
//                             scrub: true,
//                         },
//                     })
//                         .fromTo(
//                             itemInner,
//                             {
//                                 xPercent: (index, _, targets) =>
//                                     (targets.length - index - 1) * -60 - 60,
//                             },
//                             {
//                                 xPercent: 0,
//                                 ease: "power1",
//                             }
//                         )
//                         .fromTo(
//                             itemInnerWrap,
//                             {
//                                 yPercent: (index) => index * 200,
//                             },
//                             {
//                                 yPercent: 0,
//                             }
//                         );
//                     break;
//                 default:
//                     gsap.fromTo(
//                         itemInner,
//                         {
//                             xPercent: (index, _, targets) =>
//                                 index < targets.length / 2
//                                     ? -100 * index - 100
//                                     : 100 * (index - targets.length / 2) + 100,
//                             opacity: 0,
//                         },
//                         {
//                             xPercent: 0,
//                             opacity: 1,
//                             ease: "power1.inOut",
//                             scrollTrigger: {
//                                 trigger: item,
//                                 scroller: document.body,
//                                 start: "top bottom",
//                                 end: "bottom top",
//                                 scrub: true,
//                             },
//                         }
//                     );
//                     break;
//             }
//         });

//         images.forEach((image) => {
//             gsap.fromTo(
//                 image,
//                 {
//                     opacity: 0,
//                     scale: 0.8,
//                     y: 50,
//                 },
//                 {
//                     opacity: 0.15,
//                     scale: 1,
//                     y: 0,
//                     ease: "power1.inOut",
//                     scrollTrigger: {
//                         trigger: image,
//                         scroller: document.body,
//                         start: "top bottom",
//                         end: "center center",
//                         scrub: true,
//                     },
//                 }
//             );
//         });

//         ScrollTrigger.refresh();
//     };

//     return (
//         <ErrorBoundary>
//             <main ref={mainRef} className="main-container">
//                 <header className="frame frame--header">
//                     <h1 className="frame__title">Advanced Practice Psych</h1>
//                     <a
//                         className="frame__back"
//                         href="https://advancedpracticepsych.com/about-us"
//                     >
//                         About Us
//                     </a>
//                     <a
//                         className="frame__prev"
//                         href="https://advancedpracticepsych.com/contact"
//                     >
//                         Contact
//                     </a>
//                     <a
//                         className="frame__sub"
//                         href="https://advancedpracticepsych.com/services"
//                     >
//                         Services
//                     </a>
//                 </header>

//                 <div className="deco">
//                     {[...Array(18)].map((_, i) => (
//                         <div
//                             key={i}
//                             className="deco__item"
//                             style={{
//                                 backgroundImage: `url(/advanced-practice-psych/img/images/${i + 1}.jpg)`,
//                             }}
//                         ></div>
//                     ))}
//                 </div>

//                 {/* Content Sections */}
//                 <div className="content mb-80">
//                     <p className="mb-20 font-semibold opacity-50">
//                         For years, we have dedicated ourselves to helping
//                         psychiatric professionals gain new insights and skills.
//                         You'd grow your expertise through our evidence-based
//                         learning modules and expand your knowledge of modern
//                         psychiatric practice.
//                     </p>

//                     <APItem
//                         text="Expand Your Knowledge"
//                         totalCells={4}
//                         className="size-s font-5 end"
//                         effect=""
//                     />
//                 </div>

//                 <div className="content content--full mb-80">
//                     <APItem
//                         text="expertise"
//                         totalCells={4}
//                         className="size-xxl font-5 shadow-1 spaced"
//                         effect="1"
//                     />
//                 </div>

//                 <div className="content content--full mb-80">
//                     <APItem
//                         text="education"
//                         totalCells={4}
//                         className="size-xl font-4 shadow-2 color-1 spaced"
//                         effect="2"
//                     />
//                 </div>

//                 <div className="content mb-80">
//                     <p className="mb-20 font-semibold opacity-50">
//                         Through quiet reflection and rigorous study, you can
//                         elevate your psychiatric practice. You'd find clarity
//                         through our well-structured courses and feel empowered
//                         to bring new ideas into your work.
//                     </p>

//                     <APItem
//                         text="Start Learning"
//                         totalCells={4}
//                         className="size-s font-1 end"
//                         effect=""
//                     />
//                 </div>

//                 <div className="content content--full mb-80">
//                     <APItem
//                         text="growth"
//                         totalCells={4}
//                         className="size-xl font-7 shadow-1 spaced"
//                         effect="3"
//                     />
//                 </div>

//                 <div className="content content--full mb-80">
//                     <APItem
//                         text="Continue Your Journey"
//                         totalCells={4}
//                         className="size-m font-7 end"
//                         effect=""
//                     />
//                 </div>

//                 <div className="content mb-80">
//                     <p className="mb-20 font-semibold opacity-50">
//                         In a world of ever-evolving mental health challenges, we
//                         stand ready to help you stay informed. You'd stay
//                         updated on the latest research and techniques and bring
//                         fresh approaches to your practice.
//                     </p>
//                 </div>

//                 <div className="content content--full mb-80">
//                     <APItem
//                         text="innovation"
//                         totalCells={6}
//                         className="size-xl font-2 shadow-2 color-1 blendmode-1 spaced"
//                         effect="4"
//                     />
//                 </div>

//                 <div className="content content--full mb-80">
//                     <APItem
//                         text="Embrace New Knowledge"
//                         totalCells={4}
//                         className="size-m font-4 end"
//                         effect=""
//                     />
//                 </div>

//                 <div className="content mb-80">
//                     <p className="mb-20 font-semibold opacity-50">
//                         With the right educational resources, Even the most
//                         complex psychiatric challenges can be met. You'd
//                         discover new possibilities through our training programs
//                         and explore innovations that lead to improved patient
//                         care.
//                     </p>

//                     <APItem
//                         text="Lead the Change"
//                         totalCells={4}
//                         className="size-s font-1 end"
//                         effect=""
//                     />
//                 </div>

//                 <div className="content content--full mb-80">
//                     <APItem
//                         text="professionalism"
//                         totalCells={4}
//                         className="size-xxl font-6 shadow-1 spaced"
//                         effect="5"
//                     />

//                     <p className="mb-20 font-semibold opacity-50">
//                         As you grow in your career, you'd feel empowered to make
//                         a lasting impact in psychiatric care. Our programs are
//                         designed to enhance your professional journey, fostering
//                         confidence and competence.
//                     </p>
//                 </div>

//                 <div className="content mb-80">
//                     <APItem
//                         text="Take the Next Step"
//                         totalCells={4}
//                         className="size-s font-1 end"
//                         effect=""
//                     />
//                 </div>

//                 <div className="content content--full mb-80">
//                     <APItem
//                         text="clarity"
//                         totalCells={4}
//                         className="size-xl font-3 shadow-1 spaced"
//                         effect="6"
//                     />

//                     <p className="mb-20 font-semibold opacity-50">
//                         Our mission at Advanced Practice is to guide you through
//                         every step of your professional journey. You'd gain
//                         clarity and confidence as you evolve as a psychiatric
//                         practitioner, and embrace the knowledge that will help
//                         you thrive.
//                     </p>
//                 </div>

//                 <footer className="frame frame--footer">
//                     <span>
//                         <Link href="https://www.instagram.com/advancedpractice/">
//                             @advancedpractice
//                         </Link>
//                     </span>
//                     <Link href="https://www.youtube.com/@AdvanCEdpractice-io/videos">
//                         Subscribe
//                     </Link>
//                 </footer>
//             </main>
//         </ErrorBoundary>
//     );
// };

// export default AdvancedPractice;

// AdvancedPractice.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import imagesLoaded from "imagesloaded";
import Lenis from "@studio-freight/lenis";
import APItem from "@/components/AdvancedPracticePsych/APItem";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const AdvancedPractice: React.FC = () => {
    const mainRef = useRef<HTMLElement>(null);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const init = async () => {
            // Preload images and fonts
            await Promise.all([preloadImages(".deco__item"), preloadFonts()]);
            document.body.classList.remove("loading");

            // Initialize smooth scrolling and animations
            initSmoothScrolling();
            initAnimations();
        };

        init();

        // Cleanup on unmount
        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
            ScrollTrigger.killAll();
        };
    }, []);

    // Preload images to ensure they're loaded before animations
    const preloadImages = (selector = ".deco__item") => {
        return new Promise<void>((resolve) => {
            imagesLoaded(
                document.querySelectorAll(selector),
                { background: true },
                () => resolve()
            );
        });
    };

    // Preload fonts to ensure they're available before rendering text
    const preloadFonts = () => {
        return new Promise<void>((resolve) => {
            document.fonts.ready.then(() => resolve());
        });
    };

    // Initialize Lenis for smooth scrolling and integrate with ScrollTrigger
    const initSmoothScrolling = () => {
        if (!mainRef.current) return;

        // Initialize Lenis
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        // Animation frame for Lenis
        const lenisRAF = (time: number) => {
            lenisRef.current?.raf(time);
            requestAnimationFrame(lenisRAF);
        };

        requestAnimationFrame(lenisRAF);

        // Update ScrollTrigger on Lenis scroll
        lenisRef.current.on("scroll", ScrollTrigger.update);

        // Configure ScrollTrigger to use Lenis as the scroller
        ScrollTrigger.scrollerProxy(mainRef.current, {
            scrollTop(value) {
                if (arguments.length) {
                    lenisRef.current?.scrollTo(value ?? 0, { immediate: true });
                }
                return lenisRef.current?.scroll || 0;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            pinType: mainRef.current.style.transform ? "transform" : "fixed",
        });

        // Set default scroller for ScrollTrigger
        ScrollTrigger.defaults({ scroller: mainRef.current });

        // Refresh ScrollTrigger on Lenis update
        ScrollTrigger.addEventListener("refresh", () =>
            lenisRef.current?.resize()
        );

        ScrollTrigger.refresh();
    };

    // Initialize GSAP animations
    const initAnimations = () => {
        if (!mainRef.current) return;

        // Select all elements with class 'gtext' and a 'data-effect' attribute
        const items = mainRef.current.querySelectorAll<HTMLDivElement>(
            ".gtext[data-effect]"
        );
        const images =
            mainRef.current.querySelectorAll<HTMLDivElement>(".deco__item");

        // Iterate over each 'gtext' item and apply animations based on 'data-effect'
        items.forEach((item) => {
            const effect = item.getAttribute("data-effect") || "0";
            const itemInner =
                item.querySelectorAll<HTMLSpanElement>(".gtext__box-inner");
            const itemInnerWrap =
                item.querySelectorAll<HTMLSpanElement>(".gtext__box");

            switch (effect) {
                case "1":
                    gsap.fromTo(
                        itemInner,
                        {
                            xPercent: (index, _, targets) =>
                                index < targets.length / 2
                                    ? -130 * index - 130
                                    : 130 * (index - targets.length / 2) + 130,
                        },
                        {
                            xPercent: 0,
                            ease: "power1",
                            scrollTrigger: {
                                trigger: item,
                                scroller: mainRef.current,
                                start: "top bottom",
                                end: "top top+=10%",
                                scrub: true,
                            },
                        }
                    );
                    break;
                case "2":
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            scroller: mainRef.current,
                            start: "top bottom",
                            end: "top top+=10%",
                            scrub: true,
                        },
                    })
                        .fromTo(
                            itemInner,
                            { xPercent: (index) => 300 * index },
                            { xPercent: 0 }
                        )
                        .fromTo(
                            itemInnerWrap,
                            { xPercent: (index) => 200 * (index + 1) },
                            { xPercent: 0 },
                            0
                        );
                    break;
                case "3":
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            scroller: mainRef.current,
                            start: "top bottom",
                            end: "top top+=10%",
                            scrub: true,
                        },
                    })
                        .fromTo(
                            itemInner,
                            {
                                xPercent: (index, _, targets) =>
                                    index < targets.length / 2
                                        ? -300 * index - 300
                                        : 300 * (index - targets.length / 2) +
                                          300,
                                yPercent: (index, _, targets) =>
                                    index < targets.length / 2
                                        ? 150 * (targets.length / 2 - index)
                                        : 150 *
                                          (index + 1 - targets.length / 2),
                            },
                            {
                                xPercent: 0,
                                yPercent: 0,
                            }
                        )
                        .fromTo(
                            itemInnerWrap,
                            {
                                xPercent: (index) =>
                                    index * 1000 -
                                    (itemInnerWrap.length - 1) * 500,
                                rotationZ: (index, _, targets) =>
                                    index < targets.length / 2
                                        ? -50 * (targets.length / 2 - index) -
                                          50
                                        : 50 * (index - targets.length / 2) +
                                          50,
                            },
                            {
                                xPercent: 0,
                                rotationZ: 0,
                            }
                        );
                    break;
                case "4":
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            scroller: mainRef.current,
                            start: "top bottom+=30%",
                            end: "top top+=10%",
                            scrub: true,
                        },
                    })
                        .fromTo(
                            itemInner,
                            {
                                xPercent: (index, _, targets) =>
                                    index < targets.length / 2
                                        ? -500 * index - 500
                                        : 500 * (index - targets.length / 2) +
                                          500,
                            },
                            {
                                xPercent: 0,
                            }
                        )
                        .fromTo(
                            itemInner,
                            {
                                scaleX: 3,
                                scaleY: 0,
                                transformOrigin: "50% 0%",
                            },
                            {
                                scaleX: 1,
                                scaleY: 1,
                                ease: "power2.inOut",
                            }
                        )
                        .fromTo(
                            itemInnerWrap,
                            {
                                xPercent: (index) =>
                                    index * 1000 -
                                    (itemInnerWrap.length - 1) * 500,
                            },
                            {
                                xPercent: 0,
                                stagger: {
                                    amount: 0.07,
                                    from: "center",
                                },
                            }
                        );
                    break;
                case "5":
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            scroller: mainRef.current,
                            start: "top bottom",
                            end: "top top+=10%",
                            scrub: true,
                        },
                    }).fromTo(
                        itemInner,
                        {
                            xPercent: (index, _, targets) =>
                                index < targets.length / 2
                                    ? -200 * index - 200
                                    : 200 * (index - targets.length / 2) + 200,
                            yPercent: (index) => (index % 2 === 0 ? -400 : 400),
                        },
                        {
                            xPercent: 0,
                            yPercent: 0,
                        }
                    );
                    break;
                case "6":
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            scroller: mainRef.current,
                            start: "top bottom",
                            end: "top top",
                            scrub: true,
                        },
                    })
                        .fromTo(
                            itemInner,
                            {
                                xPercent: (index, _, targets) =>
                                    (targets.length - index - 1) * -60 - 60,
                            },
                            {
                                xPercent: 0,
                                ease: "power1",
                            }
                        )
                        .fromTo(
                            itemInnerWrap,
                            {
                                yPercent: (index) => index * 200,
                            },
                            {
                                yPercent: 0,
                            }
                        );
                    break;
                default:
                    gsap.fromTo(
                        itemInner,
                        {
                            xPercent: (index, _, targets) =>
                                index < targets.length / 2
                                    ? -100 * index - 100
                                    : 100 * (index - targets.length / 2) + 100,
                            opacity: 0,
                        },
                        {
                            xPercent: 0,
                            opacity: 1,
                            ease: "power1.inOut",
                            scrollTrigger: {
                                trigger: item,
                                scroller: mainRef.current,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                            },
                        }
                    );
                    break;
            }
        });

        // Animate decorative images
        images.forEach((image) => {
            gsap.fromTo(
                image,
                {
                    opacity: 0,
                    scale: 0.8,
                    y: 50,
                },
                {
                    opacity: 0.15,
                    scale: 1,
                    y: 0,
                    ease: "power1.inOut",
                    scrollTrigger: {
                        trigger: image,
                        scroller: mainRef.current,
                        start: "top bottom",
                        end: "center center",
                        scrub: true,
                    },
                }
            );
        });

        // Refresh ScrollTrigger to calculate positions
        ScrollTrigger.refresh();
    };

    return (
        <main ref={mainRef} className="main-container">
            <header className="frame frame--header">
                <h1 className="frame__title">Advanced Practice Psych</h1>
                <a
                    className="frame__back"
                    href="https://advancedpracticepsych.com/about-us"
                >
                    About Us
                </a>
                <a
                    className="frame__prev"
                    href="https://advancedpracticepsych.com/contact"
                >
                    Contact
                </a>
                <a
                    className="frame__sub"
                    href="https://advancedpracticepsych.com/services"
                >
                    Services
                </a>
            </header>

            <div className="deco">
                {[...Array(18)].map((_, i) => (
                    <div
                        key={i}
                        className="deco__item"
                        style={{
                            backgroundImage: `url(/advanced-practice-psych/img/images/${i + 1}.jpg)`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Content Sections */}
            <div className="content mb-80">
                <p className="mb-20 font-semibold opacity-50">
                    For years, we have dedicated ourselves to helping
                    psychiatric professionals gain new insights and skills.
                    You'd grow your expertise through our evidence-based
                    learning modules and expand your knowledge of modern
                    psychiatric practice.
                </p>

                <APItem
                    text="Expand Your Knowledge"
                    totalCells={4}
                    className="size-s font-5 end"
                    effect=""
                />
            </div>

            <div className="content content--full mb-80">
                <APItem
                    text="expertise"
                    totalCells={4}
                    className="size-xxl font-5 shadow-1 spaced"
                    effect="1"
                />
            </div>

            <div className="content content--full mb-80">
                <APItem
                    text="education"
                    totalCells={4}
                    className="size-xl font-4 shadow-2 color-1 spaced"
                    effect="2"
                />
            </div>

            <div className="content mb-80">
                <p className="mb-20 font-semibold opacity-50">
                    Through quiet reflection and rigorous study, you can elevate
                    your psychiatric practice. You'd find clarity through our
                    well-structured courses and feel empowered to bring new
                    ideas into your work.
                </p>

                <APItem
                    text="Start Learning"
                    totalCells={4}
                    className="size-s font-1 end"
                    effect=""
                />
            </div>

            <div className="content content--full mb-80">
                <APItem
                    text="growth"
                    totalCells={4}
                    className="size-xl font-7 shadow-1 spaced"
                    effect="3"
                />
            </div>

            <div className="content content--full mb-80">
                <APItem
                    text="Continue Your Journey"
                    totalCells={4}
                    className="size-m font-7 end"
                    effect=""
                />
            </div>

            <div className="content mb-80">
                <p className="mb-20 font-semibold opacity-50">
                    In a world of ever-evolving mental health challenges, we
                    stand ready to help you stay informed. You'd stay updated on
                    the latest research and techniques and bring fresh
                    approaches to your practice.
                </p>
            </div>

            <div className="content content--full mb-80">
                <APItem
                    text="innovation"
                    totalCells={6}
                    className="size-xl font-2 shadow-2 color-1 blendmode-1 spaced"
                    effect="4"
                />
            </div>

            <div className="content content--full mb-80">
                <APItem
                    text="Embrace New Knowledge"
                    totalCells={4}
                    className="size-m font-4 end"
                    effect=""
                />
            </div>

            <div className="content mb-80">
                <p className="mb-20 font-semibold opacity-50">
                    With the right educational resources, Even the most complex
                    psychiatric challenges can be met. You'd discover new
                    possibilities through our training programs and explore
                    innovations that lead to improved patient care.
                </p>

                <APItem
                    text="Lead the Change"
                    totalCells={4}
                    className="size-s font-1 end"
                    effect=""
                />
            </div>

            <div className="content content--full mb-80">
                <APItem
                    text="professionalism"
                    totalCells={4}
                    className="size-xxl font-6 shadow-1 spaced"
                    effect="5"
                />

                <p className="mb-20 font-semibold opacity-50">
                    As you grow in your career, you'd feel empowered to make a
                    lasting impact in psychiatric care. Our programs are
                    designed to enhance your professional journey, fostering
                    confidence and competence.
                </p>
            </div>

            <div className="content mb-80">
                <APItem
                    text="Take the Next Step"
                    totalCells={4}
                    className="size-s font-1 end"
                    effect=""
                />
            </div>

            <div className="content content--full mb-80">
                <APItem
                    text="clarity"
                    totalCells={4}
                    className="size-xl font-3 shadow-1 spaced"
                    effect="6"
                />

                <p className="mb-20 font-semibold opacity-50">
                    Our mission at Advanced Practice is to guide you through
                    every step of your professional journey. You'd gain clarity
                    and confidence as you evolve as a psychiatric practitioner,
                    and embrace the knowledge that will help you thrive.
                </p>
            </div>

            <footer className="frame frame--footer">
                <span>
                    <Link href="https://www.instagram.com/advancedpractice/">
                        @advancedpractice
                    </Link>
                </span>
                <Link href="https://www.youtube.com/@AdvanCEdpractice-io/videos">
                    Subscribe
                </Link>
            </footer>
        </main>
    );
};

export default AdvancedPractice;
