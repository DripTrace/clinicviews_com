"use client";

import React from "react";
import { motion } from "framer-motion";
import ConditionItem from "./ConditionItem";
import Image from "next/image";

interface Condition {
    name: string;
    description: string;
}

const conditions: Condition[] = [
    {
        name: "Depression",
        description:
            "A mental health disorder characterized by persistently depressed mood or loss of interest in activities, causing significant impairment in daily life.",
    },
    {
        name: "Anxiety",
        description:
            "A feeling of worry, nervousness, or unease, typically about an imminent event or something with an uncertain outcome.",
    },
    {
        name: "Bipolar Disorder",
        description:
            "A mental disorder that causes unusual shifts in mood, energy, activity levels, concentration, and the ability to carry out day-to-day tasks.",
    },
    {
        name: "Schizophrenia",
        description:
            "A chronic and severe mental disorder that affects how a person thinks, feels, and behaves.",
    },
    {
        name: "Schizoaffective Disorder",
        description:
            "A mental health disorder characterized by a combination of schizophrenia symptoms and mood disorder symptoms.",
    },
    {
        name: "ADHD",
        description:
            "A chronic condition including attention difficulty, hyperactivity, and impulsiveness.",
    },
    {
        name: "Eating Disorders",
        description:
            "Serious conditions related to persistent eating behaviors that negatively impact health, emotions, and ability to function in important areas of life.",
    },
    {
        name: "PTSD",
        description:
            "A psychiatric disorder that may occur in people who have experienced or witnessed a traumatic event.",
    },
    {
        name: "OCD",
        description:
            "A mental health disorder characterized by repetitive, unwanted thoughts (obsessions) and/or repetitive behaviors (compulsions).",
    },
    {
        name: "Conversion Disorder",
        description:
            "A condition in which a person has blindness, paralysis, or other nervous system symptoms that cannot be explained by medical evaluation.",
    },
    {
        name: "Phobia",
        description:
            "An extreme or irrational fear of or aversion to something.",
    },
    {
        name: "Substance Dependence",
        description:
            "A chronic, relapsing disorder characterized by compulsive drug seeking and use despite adverse consequences.",
    },
    {
        name: "Autism",
        description:
            "A developmental disorder characterized by difficulties with social interaction and communication, and by restricted and repetitive behavior.",
    },
    {
        name: "Impulse Control Issues",
        description:
            "Disorders characterized by problems with emotional or behavioral self-control.",
    },
    {
        name: "Personality Disorder",
        description:
            "A type of mental disorder in which you have a rigid and unhealthy pattern of thinking, functioning and behaving.",
    },
];

const ConditionsTreated: React.FC = () => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-16 bg-blue-900/80 dark:bg-gray-800 text-white relative transition-colors duration-300 rounded-xl z-20 2xl:mb-[40rem]"
        >
            <div className="absolute w-full 2xl:w-full 2xl:h-full z-30 top-[0rem] lg:top-[-4rem] xl:top-[-15.2rem] 2xl:top-[0rem]">
                <Image
                    src="/conditions.svg"
                    alt="llpmg-hero-img"
                    height={50}
                    width={150}
                    className="size-full 2xl:object-cover z-30 rounded-lg"
                />
            </div>
            <div className="container mx-auto px-4 relative z-40">
                {/* <div className="absolute h-[20rem] z-100 top-0">
					<Image
						src="/conditions.svg"
						alt="llpmg-hero-img"
						height={50}
						width={150}
						className="relativesize-full object-contain z-20 rounded-lg"
					/>
				</div> */}
                <h2 className="text-blue-200 relative text-3xl font-bold mb-8 text-center z-40">
                    Conditions We Treat
                </h2>
                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min z-40">
                    {conditions.map((condition, index) => (
                        <ConditionItem
                            key={index}
                            condition={condition.name}
                            description={condition.description}
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default ConditionsTreated;
