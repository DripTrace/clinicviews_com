"use client";
import React from "react";
import { motion } from "framer-motion";

const WhyChooseUs: React.FC = () => {
    return (
        <motion.div
            // initial={{ opacity: 0 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container mt-[4rem] mx-auto px-4 py-8 bg-blue-50/70 dark:bg-gray-700/70 rounded-md z-10"
        >
            <h2 className="text-3xl font-bold dark:text-blue-100 text-blue-900 mb-4 z-10">
                Why Choose LLPMG?
            </h2>
            <section className="mb-8 z-10">
                <h3 className="text-xl font-semibold mb-2 dark:text-blue-100 text-blue-900 z-10">
                    Mission and Vision
                </h3>
                <p className="mb-4 dark:text-blue-300 text-blue-700 z-10">
                    Our mission is to strengthen mental health, address
                    behavioral issues that currently exist, and prevent the
                    development of mental health disabilities. Our vision is to
                    promote a mentally healthy community by providing
                    individualized effective and innovative mental health care
                    for the community we serve.
                </p>
            </section>
            <section>
                <h3 className="text-xl font-semibold mb-2 dark:text-blue-100 text-blue-900 z-10">
                    Core Values
                </h3>
                <ul className="list-disc pl-5 mb-4 dark:text-blue-300 text-blue-700 z-10">
                    <li>Respect for the uniqueness of each individual</li>
                    <li>Commitment to our standard of excellence</li>
                    <li>
                        Partnership with patients, schools, communities, and
                        other organizations
                    </li>
                    <li>Education of future mental health providers</li>
                    <li>Collaborative practices between providers</li>
                </ul>
            </section>
        </motion.div>
    );
};

export default WhyChooseUs;
