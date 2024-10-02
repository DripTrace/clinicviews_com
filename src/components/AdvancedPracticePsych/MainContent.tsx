// // "use client";

// // import { useEffect, useRef } from "react";
// // import { gsap } from "gsap";
// // import { ScrollTrigger } from "gsap/ScrollTrigger";
// // import Item from "./Item";
// // import AdvancedPracticePsychLogo from "./AdvancedPracticePsychLogo";
// // import Image from "next/image";

// // gsap.registerPlugin(ScrollTrigger);

// // const MainContent: React.FC = () => {
// //     const mainRef = useRef<HTMLElement>(null);

// //     useEffect(() => {
// //         if (!mainRef.current) return;

// //         const ctx = gsap.context(() => {
// //             initItems();
// //             initAnimations();
// //         }, mainRef);

// //         return () => {
// //             ctx.revert();
// //         };
// //     }, []);

// //     const initItems = () => {
// //         const gtextElements =
// //             mainRef.current?.querySelectorAll<HTMLDivElement>("[data-text]");
// //         gtextElements?.forEach((el) => {
// //             const text = el.getAttribute("data-text") || "";
// //             const effect = el.getAttribute("data-effect");
// //             let totalCells = 6;

// //             if (effect === "1" || effect === "2" || effect === "3") {
// //                 totalCells = 4;
// //             } else if (effect === "4") {
// //                 totalCells = 6;
// //             }

// //             let newHTML = "";
// //             for (let i = 0; i < totalCells; ++i) {
// //                 newHTML += `<span class="gtext__box"><span class="gtext__box-inner">${text}</span></span>`;
// //             }

// //             el.innerHTML = newHTML;

// //             const inner =
// //                 el.querySelectorAll<HTMLSpanElement>(".gtext__box-inner");
// //             const computedWidth = window.getComputedStyle(inner[0]).width;
// //             el.style.setProperty("--text-width", computedWidth);
// //             el.style.setProperty("--gsplits", totalCells.toString());

// //             const offset = parseFloat(computedWidth) / totalCells;
// //             inner.forEach((innerEl, pos) => {
// //                 gsap.set(innerEl, { left: -offset * pos });
// //             });
// //         });
// //     };

// //     const initAnimations = () => {
// //         const items = mainRef.current?.querySelectorAll<HTMLDivElement>(
// //             ".gtext[data-effect]"
// //         );
// //         const images =
// //             mainRef.current?.querySelectorAll<HTMLDivElement>(".deco__item");

// //         items?.forEach((item) => {
// //             const effect = item.getAttribute("data-effect");
// //             const itemInner =
// //                 item.querySelectorAll<HTMLSpanElement>(".gtext__box-inner");
// //             const itemInnerWrap =
// //                 item.querySelectorAll<HTMLSpanElement>(".gtext__box");

// //             switch (effect) {
// //                 case "1":
// //                     gsap.fromTo(
// //                         itemInner,
// //                         {
// //                             xPercent: (index, _, targets) =>
// //                                 index < targets.length / 2
// //                                     ? -130 * index - 130
// //                                     : 130 * (index - targets.length / 2) + 130,
// //                         },
// //                         {
// //                             xPercent: 0,
// //                             ease: "power1",
// //                             scrollTrigger: {
// //                                 trigger: item,
// //                                 start: "top bottom",
// //                                 end: "top top+=10%",
// //                                 scrub: true,
// //                             },
// //                         }
// //                     );
// //                     break;
// //                 case "2":
// //                     gsap.timeline({
// //                         defaults: { ease: "power1" },
// //                         scrollTrigger: {
// //                             trigger: item,
// //                             start: "top bottom",
// //                             end: "top top+=10%",
// //                             scrub: true,
// //                         },
// //                     })
// //                         .fromTo(
// //                             itemInner,
// //                             { xPercent: (index) => 300 * index },
// //                             { xPercent: 0 },
// //                             0
// //                         )
// //                         .fromTo(
// //                             itemInnerWrap,
// //                             { xPercent: (index) => 200 * (index + 1) },
// //                             { xPercent: 0 },
// //                             0
// //                         );
// //                     break;
// //                 case "3":
// //                     gsap.timeline({
// //                         defaults: { ease: "power1" },
// //                         scrollTrigger: {
// //                             trigger: item,
// //                             start: "top bottom",
// //                             end: "top top+=10%",
// //                             scrub: true,
// //                         },
// //                     })
// //                         .fromTo(
// //                             itemInner,
// //                             {
// //                                 xPercent: (index, _, targets) =>
// //                                     index < targets.length / 2
// //                                         ? -300 * index - 300
// //                                         : 300 * (index - targets.length / 2) +
// //                                           300,
// //                                 yPercent: (index, _, targets) =>
// //                                     index < targets.length / 2
// //                                         ? 150 * (targets.length / 2 - index)
// //                                         : 150 *
// //                                           (index + 1 - targets.length / 2),
// //                             },
// //                             {
// //                                 xPercent: 0,
// //                                 yPercent: 0,
// //                             },
// //                             0
// //                         )
// //                         .fromTo(
// //                             itemInnerWrap,
// //                             {
// //                                 xPercent: (index) =>
// //                                     index * 1000 -
// //                                     (itemInnerWrap.length - 1) * 500,
// //                                 rotationZ: (index, _, targets) =>
// //                                     index < targets.length / 2
// //                                         ? -50 * (targets.length / 2 - index) -
// //                                           50
// //                                         : 50 * (index - targets.length / 2) +
// //                                           50,
// //                             },
// //                             {
// //                                 xPercent: 0,
// //                                 rotationZ: 0,
// //                             },
// //                             0
// //                         );
// //                     break;
// //                 case "4":
// //                     gsap.timeline({
// //                         defaults: { ease: "power1" },
// //                         scrollTrigger: {
// //                             trigger: item,
// //                             start: "top bottom+=30%",
// //                             end: "top top+=10%",
// //                             scrub: true,
// //                         },
// //                     })
// //                         .fromTo(
// //                             itemInner,
// //                             {
// //                                 xPercent: (index, _, targets) =>
// //                                     index < targets.length / 2
// //                                         ? -500 * index - 500
// //                                         : 500 * (index - targets.length / 2) +
// //                                           500,
// //                             },
// //                             {
// //                                 xPercent: 0,
// //                             },
// //                             0
// //                         )
// //                         .fromTo(
// //                             itemInner,
// //                             {
// //                                 scaleX: 3,
// //                                 scaleY: 0,
// //                                 transformOrigin: "50% 0%",
// //                             },
// //                             {
// //                                 scaleX: 1,
// //                                 scaleY: 1,
// //                                 ease: "power2.inOut",
// //                             },
// //                             0
// //                         )
// //                         .fromTo(
// //                             itemInnerWrap,
// //                             {
// //                                 xPercent: (index) =>
// //                                     index * 1000 -
// //                                     (itemInnerWrap.length - 1) * 500,
// //                             },
// //                             {
// //                                 xPercent: 0,
// //                                 stagger: {
// //                                     amount: 0.07,
// //                                     from: "center",
// //                                 },
// //                             },
// //                             0
// //                         );
// //                     break;
// //                 case "5":
// //                     gsap.timeline({
// //                         defaults: { ease: "power1" },
// //                         scrollTrigger: {
// //                             trigger: item,
// //                             start: "top bottom",
// //                             end: "top top+=10%",
// //                             scrub: true,
// //                         },
// //                     }).fromTo(
// //                         itemInner,
// //                         {
// //                             xPercent: (index, _, targets) =>
// //                                 index < targets.length / 2
// //                                     ? -200 * index - 200
// //                                     : 200 * (index - targets.length / 2) + 200,
// //                             yPercent: (index) => (index % 2 === 0 ? -400 : 400),
// //                         },
// //                         {
// //                             xPercent: 0,
// //                             yPercent: 0,
// //                         },
// //                         0
// //                     );
// //                     break;
// //                 case "6":
// //                     gsap.timeline({
// //                         scrollTrigger: {
// //                             trigger: item,
// //                             start: "top bottom",
// //                             end: "top top",
// //                             scrub: true,
// //                         },
// //                     })
// //                         .fromTo(
// //                             itemInner,
// //                             {
// //                                 xPercent: (index, _, targets) =>
// //                                     (targets.length - index - 1) * -60 - 60,
// //                             },
// //                             {
// //                                 xPercent: 0,
// //                                 ease: "power1",
// //                             },
// //                             0
// //                         )
// //                         .fromTo(
// //                             itemInnerWrap,
// //                             {
// //                                 yPercent: (index) => index * 200,
// //                             },
// //                             {
// //                                 yPercent: 0,
// //                             },
// //                             0
// //                         );
// //                     break;
// //                 default:
// //                     gsap.fromTo(
// //                         itemInner,
// //                         {
// //                             xPercent: (index, _, targets) =>
// //                                 index < targets.length / 2
// //                                     ? -100 * index - 100
// //                                     : 100 * (index - targets.length / 2) + 100,
// //                         },
// //                         {
// //                             xPercent: 0,
// //                             ease: "power1",
// //                             scrollTrigger: {
// //                                 trigger: item,
// //                                 start: "top bottom",
// //                                 end: "top top+=10%",
// //                                 scrub: true,
// //                             },
// //                         }
// //                     );
// //             }
// //         });

// //         images?.forEach((image) => {
// //             gsap.fromTo(
// //                 image,
// //                 {
// //                     rotationZ: -8,
// //                 },
// //                 {
// //                     rotationZ: 5,
// //                     ease: "none",
// //                     scrollTrigger: {
// //                         trigger: image,
// //                         start: "top bottom",
// //                         end: "bottom top",
// //                         scrub: true,
// //                     },
// //                 }
// //             );
// //         });
// //     };

// //     return (
// //         <main ref={mainRef} className="main-container">
// //             {/* Header */}
// //             <header className="frame frame--header">
// //                 <h1 className="frame__title">
// //                     Advanced Practice
// //                     {/* <AdvancedPracticePsychLogo
// //                         id="advanced-practice-psych-logo"
// //                         className="bg-white-100 absolute top-[1rem] right-[1rem] h-[9rem] w-[9rem] z-50"
// //                     /> */}
// //                 </h1>
// //                 <a
// //                     className="frame__back"
// //                     href="https://advancedpracticepsych.com/about-us"
// //                 >
// //                     About Us
// //                 </a>
// //                 <a
// //                     className="frame__prev"
// //                     href="https://advancedpracticepsych.com/contact"
// //                 >
// //                     Contact
// //                 </a>
// //                 <a
// //                     className="frame__sub"
// //                     href="https://advancedpracticepsych.com/services"
// //                 >
// //                     Services
// //                 </a>
// //             </header>

// //             {/* Decorative Images */}
// //             {/* <div className="deco">
// //                 {[...Array(18)].map((_, i) => (
// //                     // <div
// //                     //     key={i}
// //                     //     className="deco__item"
// //                     //     style={{
// //                     //         backgroundImage: `url(/advanced-practice-psych/img/images/${i + 1}.jpg)`,
// //                     //     }}
// //                     // ></div>
// //                     <Image
// //                         key={i}
// //                         className="deco__item"
// //                         src={`/advanced-practice-psych/img/images/${i + 1}.jpg)}`}
// //                         height={720}
// //                         width={1080}
// //                         alt={`${i}`}
// //                     />
// //                 ))}
// //             </div> */}
// //             {/* <div className="">
// //                 <Image
// //                     className="size-[10rem] absolute top-0 right-0 z-50 deco__item"
// //                     src="/advanced-practice-psych/img/images/1.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //             </div> */}
// //             {/* <div className="deco"> */}
// //             <div className="deco">
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/1.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/2.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/3.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/4.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/5.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/6.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/7.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/8.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/9.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/10.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/11.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/12.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/13.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/14.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/15.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/16.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/17.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //                 <Image
// //                     className="deco__item"
// //                     src="/advanced-practice-psych/img/images/18.jpg"
// //                     height={720}
// //                     width={1080}
// //                     alt=""
// //                 />
// //             </div>

// //             {/* Content Sections */}
// //             <div className="content">
// //                 <p>
// //                     At Advanced Practice,
// //                     <br />
// //                     We are committed to advancing the knowledge
// //                     <br />
// //                     of mental health professionals.
// //                     <br />
// //                     You'd enhance your skills through our curated programs
// //                     <br />
// //                     and deepen your understanding of psychiatric care.
// //                 </p>

// //                 <h2
// //                     className="gtext size-s font-4 end"
// //                     data-text="Enhance Your Practice"
// //                 >
// //                     Enhance Your Practice
// //                 </h2>
// //             </div>

// //             <div className="content content--full">
// //                 <h3
// //                     className="gtext size-xxl font-5 shadow-1 spaced"
// //                     data-text="expertise"
// //                     data-effect="1"
// //                 >
// //                     expertise
// //                 </h3>
// //             </div>

// //             <div className="content">
// //                 <p>
// //                     For years, we have dedicated ourselves to helping
// //                     psychiatric professionals
// //                     <br />
// //                     gain new insights and skills.
// //                     <br />
// //                     You'd grow your expertise through our evidence-based
// //                     learning modules
// //                     <br />
// //                     and expand your knowledge of modern psychiatric practice.
// //                 </p>

// //                 <h2
// //                     className="gtext size-s font-5 end"
// //                     data-text="Expand Your Knowledge"
// //                 >
// //                     Expand Your Knowledge
// //                 </h2>
// //             </div>

// //             <div className="content content--full">
// //                 <h3
// //                     className="gtext size-xl font-4 shadow-2 color-1 spaced"
// //                     data-text="education"
// //                     data-effect="2"
// //                 >
// //                     education
// //                 </h3>
// //             </div>

// //             <div className="content">
// //                 <p>
// //                     Through quiet reflection and rigorous study,
// //                     <br />
// //                     You can elevate your psychiatric practice.
// //                     <br />
// //                     You'd find clarity through our well-structured courses
// //                     <br />
// //                     and feel empowered to bring new ideas into your work.
// //                 </p>

// //                 <h2
// //                     className="gtext size-s font-1 end"
// //                     data-text="Start Learning"
// //                 >
// //                     Start Learning
// //                 </h2>
// //             </div>

// //             <div className="content content--full">
// //                 <h3
// //                     className="gtext size-xl font-7 shadow-1 spaced"
// //                     data-text="growth"
// //                     data-effect="3"
// //                 >
// //                     growth
// //                 </h3>
// //             </div>

// //             <div className="content content--full">
// //                 <h2
// //                     className="gtext size-m font-7 end"
// //                     data-text="Continue Your Journey"
// //                 >
// //                     Continue Your Journey
// //                 </h2>
// //             </div>

// //             <div className="content">
// //                 <p>
// //                     In a world of ever-evolving mental health challenges,
// //                     <br />
// //                     We stand ready to help you stay informed.
// //                     <br />
// //                     You'd stay updated on the latest research and techniques
// //                     <br />
// //                     and bring fresh approaches to your practice.
// //                 </p>
// //             </div>

// //             <div className="content content--full">
// //                 <h3
// //                     className="gtext size-xl font-2 shadow-2 color-1 blendmode-1 spaced"
// //                     data-text="innovation"
// //                     data-effect="4"
// //                 >
// //                     innovation
// //                 </h3>
// //             </div>

// //             <div className="content content--full">
// //                 <h2
// //                     className="gtext size-m font-4 end"
// //                     data-text="Embrace New Knowledge"
// //                 >
// //                     Embrace New Knowledge
// //                 </h2>
// //             </div>

// //             <div className="content">
// //                 <p>
// //                     With the right educational resources,
// //                     <br />
// //                     Even the most complex psychiatric challenges can be met.
// //                     <br />
// //                     You'd discover new possibilities through our training
// //                     programs
// //                     <br />
// //                     and explore innovations that lead to improved patient care.
// //                 </p>

// //                 <h2
// //                     className="gtext size-s font-1 end"
// //                     data-text="Lead the Change"
// //                 >
// //                     Lead the Change
// //                 </h2>
// //             </div>

// //             <div className="content content--full">
// //                 <h3
// //                     className="gtext size-xxl font-6 shadow-1 spaced"
// //                     data-text="professionalism"
// //                     data-effect="5"
// //                 >
// //                     professionalism
// //                 </h3>

// //                 <p>
// //                     As you grow in your career,
// //                     <br />
// //                     You'd feel empowered to make a lasting impact in psychiatric
// //                     care.
// //                     <br />
// //                     Our programs are designed to enhance your professional
// //                     journey,
// //                     <br />
// //                     fostering confidence and competence.
// //                 </p>
// //             </div>

// //             <div className="content">
// //                 <h2
// //                     className="gtext size-s font-1 end"
// //                     data-text="Take the Next Step"
// //                 >
// //                     Take the Next Step
// //                 </h2>
// //             </div>

// //             <div className="content content--full">
// //                 <h3
// //                     className="gtext size-xl font-3 shadow-1 spaced"
// //                     data-text="clarity"
// //                     data-effect="6"
// //                 >
// //                     clarity
// //                 </h3>

// //                 <p>
// //                     Our mission at Advanced Practice
// //                     <br />
// //                     is to guide you through every step of your professional
// //                     journey.
// //                     <br />
// //                     You'd gain clarity and confidence as you evolve as a
// //                     psychiatric practitioner,
// //                     <br />
// //                     and embrace the knowledge that will help you thrive.
// //                 </p>
// //             </div>

// //             {/* Footer */}
// //             <footer className="frame frame--footer">
// //                 <span>
// //                     Created by{" "}
// //                     <a href="https://x.com/advancedpracticepsych">
// //                         @AdvancedPracticePsych
// //                     </a>
// //                 </span>
// //                 <a href="https://advancedpracticepsych.com/subscribe">
// //                     Subscribe
// //                 </a>
// //             </footer>
// //         </main>
// //     );
// // };

// // export default MainContent;

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const MainContent: React.FC = () => {
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!mainRef.current) return;

        const ctx = gsap.context(() => {
            initItems();
            initAnimations();
        }, mainRef);

        return () => {
            ctx.revert();
        };
    }, []);

    const initItems = () => {
        const gtextElements =
            mainRef.current?.querySelectorAll<HTMLDivElement>("[data-text]");
        gtextElements?.forEach((el) => {
            const text = el.getAttribute("data-text") || "";
            const effect = el.getAttribute("data-effect");
            let totalCells = 6;

            if (effect === "1" || effect === "2" || effect === "3") {
                totalCells = 4;
            } else if (effect === "4") {
                totalCells = 6;
            }

            let newHTML = "";
            for (let i = 0; i < totalCells; ++i) {
                newHTML += `<span class="gtext__box"><span class="gtext__box-inner">${text}</span></span>`;
            }

            el.innerHTML = newHTML;

            const inner =
                el.querySelectorAll<HTMLSpanElement>(".gtext__box-inner");
            const computedWidth = window.getComputedStyle(inner[0]).width;
            el.style.setProperty("--text-width", computedWidth);
            el.style.setProperty("--gsplits", totalCells.toString());

            const offset = parseFloat(computedWidth) / totalCells;
            inner.forEach((innerEl, pos) => {
                gsap.set(innerEl, { left: -offset * pos });
            });
        });
    };

    const initAnimations = () => {
        const items = mainRef.current?.querySelectorAll<HTMLDivElement>(
            ".gtext[data-effect]"
        );
        const images =
            mainRef.current?.querySelectorAll<HTMLDivElement>(".deco__item");

        items?.forEach((item) => {
            const effect = item.getAttribute("data-effect");
            const itemInner =
                item.querySelectorAll<HTMLSpanElement>(".gtext__box-inner");
            const itemInnerWrap =
                item.querySelectorAll<HTMLSpanElement>(".gtext__box");

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
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                }
            );
        });

        images?.forEach((image, index) => {
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
                        start: "top bottom",
                        end: "center center",
                        scrub: true,
                    },
                }
            );
        });
    };

    return (
        <main ref={mainRef} className="main-container">
            <header className="frame frame--header">
                <h1 className="frame__title">Advanced Practice</h1>
                <a className="frame__back" href="/about-us">
                    About Us
                </a>
                <a className="frame__prev" href="/contact">
                    Contact
                </a>
                <a className="frame__sub" href="/services">
                    Services
                </a>
            </header>

            <div className="content">
                <p>
                    At Advanced Practice,
                    <br />
                    We are committed to advancing the knowledge
                    <br />
                    of mental health professionals.
                    <br />
                    You'd enhance your skills through our curated programs
                    <br />
                    and deepen your understanding of psychiatric care.
                </p>

                <h2
                    className="gtext size-s font-4 end"
                    data-text="Enhance Your Practice"
                >
                    Enhance Your Practice
                </h2>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-xxl font-5 shadow-1 spaced"
                    data-text="expertise"
                    data-effect="1"
                >
                    expertise
                </h3>
            </div>

            <div className="content">
                <p>
                    For years, we have dedicated ourselves to helping
                    <br />
                    psychiatric professionals gain new insights and skills.
                    <br />
                    You'd grow your expertise through our evidence-based
                    <br />
                    learning modules and expand your knowledge of modern
                    psychiatric practice.
                </p>

                <h2
                    className="gtext size-s font-5 end"
                    data-text="Expand Your Knowledge"
                >
                    Expand Your Knowledge
                </h2>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-xl font-4 shadow-2 color-1 spaced"
                    data-text="education"
                    data-effect="2"
                >
                    education
                </h3>
            </div>

            <div className="content">
                <p>
                    Through quiet reflection and rigorous study,
                    <br />
                    You can elevate your psychiatric practice.
                    <br />
                    You'd find clarity through our well-structured courses
                    <br />
                    and feel empowered to bring new ideas into your work.
                </p>

                <h2
                    className="gtext size-s font-1 end"
                    data-text="Start Learning"
                >
                    Start Learning
                </h2>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-xl font-7 shadow-1 spaced"
                    data-text="growth"
                    data-effect="3"
                >
                    growth
                </h3>
            </div>

            <div className="content content--full">
                <h2
                    className="gtext size-m font-7 end"
                    data-text="Continue Your Journey"
                >
                    Continue Your Journey
                </h2>
            </div>

            <div className="content">
                <p>
                    In a world of ever-evolving mental health challenges,
                    <br />
                    We stand ready to help you stay informed.
                    <br />
                    You'd stay updated on the latest research and techniques
                    <br />
                    and bring fresh approaches to your practice.
                </p>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-xl font-2 shadow-2 color-1 blendmode-1 spaced"
                    data-text="innovation"
                    data-effect="4"
                >
                    innovation
                </h3>
            </div>

            <div className="content content--full">
                <h2
                    className="gtext size-m font-4 end"
                    data-text="Embrace New Knowledge"
                >
                    Embrace New Knowledge
                </h2>
            </div>

            <div className="content">
                <p>
                    With the right educational resources,
                    <br />
                    Even the most complex psychiatric challenges can be met.
                    <br />
                    You'd discover new possibilities through our training
                    programs
                    <br />
                    and explore innovations that lead to improved patient care.
                </p>

                <h2
                    className="gtext size-s font-1 end"
                    data-text="Lead the Change"
                >
                    Lead the Change
                </h2>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-xxl font-6 shadow-1 spaced"
                    data-text="professionalism"
                    data-effect="5"
                >
                    professionalism
                </h3>

                <p>
                    As you grow in your career,
                    <br />
                    You'd feel empowered to make a lasting impact in psychiatric
                    care.
                    <br />
                    Our programs are designed to enhance your professional
                    journey,
                    <br />
                    fostering confidence and competence.
                </p>
            </div>

            <div className="content">
                <h2
                    className="gtext size-s font-1 end"
                    data-text="Take the Next Step"
                >
                    Take the Next Step
                </h2>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-xl font-3 shadow-1 spaced"
                    data-text="clarity"
                    data-effect="6"
                >
                    clarity
                </h3>

                <p>
                    Our mission at Advanced Practice
                    <br />
                    is to guide you through every step of your professional
                    journey.
                    <br />
                    You'd gain clarity and confidence as you evolve as a
                    psychiatric practitioner,
                    <br />
                    and embrace the knowledge that will help you thrive.
                </p>
            </div>

            <div className="deco">
                {[...Array(18)].map((_, i) => (
                    <div key={i} className="deco__item">
                        <Image
                            src={`/advanced-practice-psych/img/images/${i + 1}.jpg`}
                            alt={`Decorative image ${i + 1}`}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                ))}
            </div>

            <footer className="frame frame--footer">
                <span>
                    {/* Created by{" "} */}
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

export default MainContent;

// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Image from "next/image";

// gsap.registerPlugin(ScrollTrigger);

// const MainContent: React.FC = () => {
//     const mainRef = useRef<HTMLElement>(null);

//     useEffect(() => {
//         if (!mainRef.current) return;

//         const ctx = gsap.context(() => {
//             initItems();
//             initAnimations();
//         }, mainRef);

//         return () => {
//             ctx.revert();
//         };
//     }, []);

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

//             gsap.fromTo(
//                 itemInner,
//                 {
//                     xPercent: (index, _, targets) =>
//                         index < targets.length / 2
//                             ? -100 * index - 100
//                             : 100 * (index - targets.length / 2) + 100,
//                     opacity: 0,
//                 },
//                 {
//                     xPercent: 0,
//                     opacity: 1,
//                     ease: "power1.inOut",
//                     scrollTrigger: {
//                         trigger: item,
//                         start: "top bottom",
//                         end: "bottom top",
//                         scrub: true,
//                     },
//                 }
//             );
//         });

//         images?.forEach((image, index) => {
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
//                         start: "top bottom",
//                         end: "center center",
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
//                 <a className="frame__back" href="/about-us">
//                     About Us
//                 </a>
//                 <a className="frame__prev" href="/contact">
//                     Contact
//                 </a>
//                 <a className="frame__sub" href="/services">
//                     Services
//                 </a>
//             </header>

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

//             <div className="content">
//                 <p>
//                     We'll also offer resources for CE credits and keep you
//                     updated on relevant industry news.
//                 </p>
//             </div>

//             <div className="content">
//                 <h2
//                     className="gtext size-l font-4"
//                     data-text="Follow along and join our vibrant community of learners!"
//                 >
//                     Follow along and join our vibrant community of learners!
//                 </h2>
//                 <p>
//                     This page is dedicated to providing high-quality,
//                     evidence-based
//                     <br />
//                     information on various mental health topics. We'll deep dive
//                     into:
//                 </p>
//                 <ul>
//                     <li>Medication management insights</li>
//                     <li>Diagnoses & treatment approaches</li>
//                     <li>The latest research & advancements in psychiatry</li>
//                     <li>Patient experiences & coping strategies</li>
//                 </ul>
//             </div>

//             <div className="content">
//                 <h2 className="gtext size-m font-5" data-text="Are you a...">
//                     Are you a...
//                 </h2>
//                 <ul>
//                     <li>
//                         Curious patient seeking info on mental health conditions
//                         & treatment options?
//                     </li>
//                     <li>
//                         Student or nurse on the path to becoming a mental health
//                         professional?
//                     </li>
//                     <li>
//                         Practicing psychiatrist, NP, or researcher looking to
//                         expand your knowledge?
//                     </li>
//                     <li>Nurse needing CE credits for license renewal?</li>
//                     <li>
//                         Anyone who wants to learn more about the fascinating
//                         world of psychiatry and mental health?
//                     </li>
//                 </ul>
//                 <p>Then you've come to the right place!</p>
//                 <h3
//                     className="gtext size-s font-4"
//                     data-text="Explore the world of psychiatry with me"
//                 >
//                     Explore the world of psychiatry with me
//                 </h3>
//             </div>

//             <div className="content">
//                 <h2
//                     className="gtext size-l font-5"
//                     data-text="@advancEdPracticePsych"
//                 >
//                     @advancEdPracticePsych
//                 </h2>
//                 <p>
//                     deep dives into mental health to unveil the complexities of
//                     the mind,
//                     <br />
//                     one post at a time.
//                     <br />
//                     This is an educational hub for patients, students,
//                     professionals & anyone
//                     <br />
//                     seeking to understand mental health.
//                 </p>
//             </div>

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

//             <footer className="frame frame--footer">
//                 <span>
//                     Created by{" "}
//                     <a href="https://x.com/advancedpracticepsych">
//                         @AdvancedPracticePsych
//                     </a>
//                 </span>
//                 <a href="/subscribe">Subscribe</a>
//             </footer>
//         </main>
//     );
// };

// export default MainContent;
