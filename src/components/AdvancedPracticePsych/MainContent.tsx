// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Image from "next/image";
// import Link from "next/link";
// import InstaPost from "./InstaPost";

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

//             {/* <InstaPost /> */}

//             <footer className="frame frame--footer">
//                 <span>
//                     {/* Created by{" "} */}
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

// export default MainContent;

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import InstaPost from "./InstaPost";

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
                <a className="frame__back" href="/">
                    About Us
                </a>
                <a className="frame__prev" href="/">
                    Contact
                </a>
                <a className="frame__sub" href="/">
                    Services
                </a>
            </header>

            {/* <div className="deco">
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
            </div> */}

            <div className="content">
                <p>
                    Welcome to Advanced Practice
                    <br />
                    Discover the World of Mental Health
                    <br />
                    Are you a curious patient seeking information about mental
                    health conditions and treatment options?
                    <br />
                    A student or nurse on the path to becoming a mental health
                    professional?
                    <br />A practicing psychiatrist, nurse practitioner, or
                    researcher looking to expand your knowledge?
                </p>

                <h2
                    className="gtext size-s font-4 end"
                    data-text="Or simply someone interested in learning more about the "
                >
                    Or simply someone interested in learning more about the
                </h2>
                <h2
                    className="gtext size-s font-4 end"
                    data-text="fascinating field of psychiatry and mental health?"
                >
                    fascinating field of psychiatry and mental health?
                </h2>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <h2
                    className="gtext size-s font-4 justify-content-start justify-self-start"
                    data-text="You've come to the right place."
                >
                    You've come to <br /> the right place.
                </h2>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-m font-5 shadow-1 spaced"
                    data-text="Advanced Practice"
                    data-effect="1"
                >
                    Advanced Practice
                </h3>
            </div>

            <div className="content">
                <p>
                    Advanced Practice is your one-stop resource for all things
                    mental health.
                    <br />
                    We offer a wealth of information, resources, and
                    opportunities for professional development.
                    <br />
                    Explore our website to:
                    <br />
                    Learn about various mental health conditions and their
                    treatments.
                    <br />
                    Find resources and support for patients and their families.
                </p>

                <h2
                    className="gtext size-s font-5 end"
                    data-text="Access continuing education courses for healthcare professionals."
                >
                    Access continuing education courses for healthcare
                    professionals.
                </h2>
            </div>

            <div className="content min-h-[75vh] grid place-items-center">
                <h3
                    className="gtext size-m font-4 shadow-2 color-1 spaced"
                    data-text="Connect"
                    data-effect="2"
                >
                    Connect
                </h3>
            </div>

            <div className="content">
                <p>
                    Connect with other mental health professionals and
                    advocates.
                    <br />
                    Stay up-to-date on the latest research and developments in
                    the field.
                    <br />
                    Join us on this journey of discovery and growth.
                    <br />
                    {/* Website Description: */}
                    <br />
                    AdvanCEd Practice is your go-to online resource <br />
                    for professional development and mental health education.
                </p>

                <h2
                    className="gtext size-s font-1 end"
                    data-text="This is an educational hub"
                >
                    This is an educational hub designed to empower nurses,
                </h2>
                <h2
                    className="gtext size-s font-1 end"
                    data-text="designed to empower nurses,"
                >
                    designed to empower nurses,
                </h2>
                <h2
                    className="gtext size-s font-1 end"
                    data-text="practitioners, mental health advocates,"
                >
                    practitioners, mental health advocates,
                </h2>
                <h2
                    className="gtext size-s font-1 end"
                    data-text="educators, students,"
                >
                    educators, students,
                </h2>
                <h2
                    className="gtext size-s font-1 end"
                    data-text="and patients with the"
                >
                    and patients with the
                </h2>
                <h2
                    className="gtext size-s font-1 end"
                    data-text="knowledge and tools they need to"
                >
                    knowledge and tools they need to
                </h2>
                <h2
                    className="gtext size-s font-1 end"
                    data-text="improve mental health care."
                >
                    improve mental health care.
                </h2>
                {/* <br />
                <br />
                <br />
                <h2
                    className="gtext size-s font-1 end"
                    data-text="nurse
                    practitioners, mental health advocates, educators, students,
                    and patients with the knowledge and tools they need to
                    improve mental health care."
                >
                    nurse practitioners, mental health advocates, educators,
                    students, and patients with the knowledge and tools they
                    need to improve mental health care.
                </h2> */}
                {/* <h2
                    className="gtext size-s font-1 end"
                    data-text="nurse practitioners, mental health advocates, educators, students, and patients with the knowledge and tools they need to improve mental health care."
                >
                    nurse practitioners, mental health advocates, educators,
                    students, and patients with the knowledge and tools they
                    need to improve mental health care.
                </h2> */}
                {/* <h2
                    className="gtext size-s font-1 end"
                    data-text="Key Features:"
                >
                    Key Features:
                </h2> */}
            </div>

            <div className="content min-h-[75vh] grid place-items-center">
                <h2
                    className="gtext size-s font-1 place-content-start place-self-start"
                    data-text="Key Features:"
                >
                    Key Features:
                </h2>
                <h3
                    className="gtext size-xl font-7 shadow-1 spaced"
                    data-text="Library"
                    data-effect="3"
                >
                    Library
                </h3>
            </div>

            <div className="content content--full">
                <h2
                    className="gtext size-s font-7 end"
                    data-text="Library of Condensed Articles:"
                >
                    Library of Condensed Articles:
                </h2>
            </div>

            <div className="content">
                <p>
                    Access a collection of expertly written articles condensed
                    for busy professionals or students who need to stay informed
                    on various mental health topics, covering everything from
                    mental health conditions to treatment approaches and
                    research findings.
                    <br />
                    <br />
                    NOTE: condensed articles should not be used as a substitute
                    for reading the full text. While they can provide a good
                    overview of a topic, they may not include all of the
                    important details. If you need to have a deep understanding
                    of a subject, it's essential to read the full article.
                    <br />
                    <br />
                    Continuing Education Courses:
                    <br />
                    Earn CEUs through our online courses, tailored to meet the
                    needs of healthcare professionals at all levels. Our courses
                    are designed to be engaging, informative, and relevant to
                    your practice.
                </p>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-m font-2 shadow-2 color-1 blendmode-1 spaced"
                    data-text="Case Studies"
                    data-effect="4"
                >
                    Case Studies
                </h3>
            </div>

            <div className="content content--full">
                <h2
                    className="gtext size-s font-4 end"
                    data-text="Case Studies:"
                >
                    Case Studies:
                </h2>
            </div>

            <div className="content">
                <p>
                    Explore real-world case studies to enhance your
                    understanding of mental health conditions and treatment
                    approaches.
                    <br />
                    Learn from the experiences of others and develop your
                    clinical judgment skills.
                    <br />
                    Community Forums:
                    <br />
                    Connect with like-minded professionals and share
                    experiences, ask questions, and find support. Our community
                    forums provide a space for open discussion and
                    collaboration.
                </p>

                <h2
                    className="gtext size-s font-1 end"
                    data-text="Latest News and Updates:"
                >
                    Latest News and Updates:
                </h2>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-m font-6 shadow-1 spaced"
                    data-text="Stay informed"
                    data-effect="5"
                >
                    Stay informed
                </h3>

                <p>
                    Stay informed about the latest research, policy changes, and
                    industry trends in mental health.
                    <br />
                    We keep you up-to-date with the most relevant information so
                    you can provide the best possible care to your patients.
                    <br />
                    Resources for Patients:
                    <br />
                    Find information on mental health conditions, treatment
                    options, and support services for patients and their
                    families. We believe in empowering patients to take an
                    active role in their mental health care.
                </p>
            </div>

            <div className="content">
                <h2
                    className="gtext size-s font-1 end"
                    data-text="Our Mission:"
                >
                    Our Mission:
                </h2>
            </div>

            <div className="content content--full">
                <h3
                    className="gtext size-m font-3 shadow-1 spaced"
                    data-text="Our Mission"
                    data-effect="6"
                >
                    Our Mission
                </h3>

                <p>
                    To promote quality education, mental health awareness, and
                    advocacy.
                    <br />
                    We aim to bridge the gap in mental health education and
                    provide accessible, high-quality resources.
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

export default MainContent;
