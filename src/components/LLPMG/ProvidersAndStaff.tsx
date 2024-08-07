"use client";

import Image from "next/image";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaUserDoctor, FaUser } from "react-icons/fa6";

interface StaffMember {
    alt: string;
    url: string;
    name: string;
    title: string;
    role: string;
    degree: string;
}

const ProvidersAndStaff: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const staffMembers: StaffMember[] = [
        {
            alt: "Mubashir_Farooqi_MD",
            url: "/providers-and-staff/Mubashir_Farooqi.webp",
            name: "Mubashir Farooqi",
            title: "Psychiatrist",
            role: "provider",
            degree: "M.D.",
        },
        {
            alt: "Liberty_Olive_Macias_DNP",
            url: "/providers-and-staff/Liberty_Olive_Macias.webp",
            name: "Liberty Olive RB Macias",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "DNP, PMHNP-BC",
        },
        {
            alt: "Uloma_Anozie_DNP",
            url: "/providers-and-staff",
            name: "Uloma Anozie",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "DNP",
        },
        // {
        //alt: "",
        // url: "/providers-and-staff",//
        // name: "Steven Huerta, PMHNP-BC",
        // 	title: "Psychiatric Nurse Practitioner",
        // 	role: "provider",
        // },
        {
            alt: "Carolyn_Alexander_LMFT",
            url: "/providers-and-staff/Carolyn_Alexandar.webp",
            name: "Carolyn Alexander",
            title: "Psychotherapist",
            role: "provider",
            degree: "LMFT",
        },
        // {
        //alt: "",
        // url: "/providers-and-staff",//
        // name: "Savanna Olsson, PMHNP-BC",
        // 	title: "Psychiatric Nurse Practitioner",
        // 	role: "provider",
        // },
        {
            alt: "Jonathan_Clay_PMHNP-BC",
            url: "/providers-and-staff",
            name: "Jonathan Clay",
            title: "Nurse Practitioner",
            role: "provider",
            degree: "PMHNP-BC",
        },
        {
            alt: "Edmund_Young_Ed_D_LCSW_MSG_BCD.webp",
            url: "/providers-and-staff",
            name: "Edmund Young",
            title: "Psychotherapist",
            role: "provider",
            degree: "Ed.D, LCSw, M.S.G, B.C.D",
        },
        {
            alt: "Don_Kreger_PhD",
            url: "/providers-and-staff/Don_Kreger.webp",
            name: "Don W. Kreger",
            title: "Psychologist",
            role: "provider",
            degree: "Ph.D",
        },
        {
            alt: "Tatum_David_PMHNP-BC",
            url: "/providers-and-staff/Tatum_David.webp",
            name: "Tatum David",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "PMHNP-BC",
        },
        {
            alt: "Nashwa_Moustafa_PMHNP-BC",
            url: "/providers-and-staff",
            name: "Nashwa Moustafa",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "PMHNP-BC",
        },
        {
            alt: "Adaobi_Adimorah_PMHNP-BC",
            url: "/providers-and-staff",
            name: "Adaobi Adimorah",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "PMHNP-BC",
        },
        {
            alt: "Guy_Biakop_PMHNP-BC",
            url: "/providers-and-staff/Guy_Biakop.webp",
            name: "Guy Biakop",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "PMHNP-BC",
        },
        // {
        //alt: "",
        // url: "/providers-and-staff",//
        // name: "Esther Lu, FNP-C",
        // 	title: "Family Nurse Practitioner",
        // 	role: "provider",
        // },
        {
            alt: "Joytila_Singh_MD",
            url: "/providers-and-staff/Joytila_Singh.webp",
            name: "Joytila Singh",
            title: "Psychiatrist",
            role: "provider",
            degree: "M.D.",
        },
        {
            alt: "Alex_Capuchino_DNP",
            url: "/providers-and-staff",
            name: "Alex Capuchino",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "DNP",
        },
        {
            alt: "Martin_Calixterio_DNP",
            url: "/providers-and-staff",
            name: "Martin Calixterio",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "DNP",
        },
        {
            alt: "Gaddiel_Sarmiento_MSN",
            url: "/providers-and-staff",
            name: "Gaddiel Sarmiento",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "M.S.N.",
        },
        // {

        // },
        {
            alt: "Daniel_Padua_MD",
            url: "/providers-and-staff",
            name: "Daniel Padua",
            title: "Psychiatrist",
            role: "provider",
            degree: "M.D.",
        },

        // {
        // 	alt: "Charles_Nguyen_MD",
        // 	url: "/providers-and-staff/Charles_Nguyen.webp",
        // 	name: "Charles Nguyen",
        // 	title: "Psychiatrist",
        // 	role: "provider",
        // 	degree: "M.D.",
        // },
        // {
        //alt: "",
        // url: "/providers-and-staff",//
        // name: "Jazmyne Bosley, DNP, PMHNP-BC",
        // 	title: "Psychiatric Nurse Practitioner",
        // 	role: "provider",
        // },
        {
            alt: "Nelly_Saucedo_LCSW",
            url: "/providers-and-staff/Nelly_Saucedo.webp",
            name: "Nelly Saucedo",
            title: "Psychotherapist",
            role: "provider",
            degree: "LCSW",
        },
        // {
        //alt: "",
        // url: "/providers-and-staff",//
        // name: "Daphne Erhart, PsyD",
        // 	title: "Psychologist",
        // 	role: "provider",
        // },
        {
            alt: "Marlene_Millan_PMHNP-BC",
            url: "/providers-and-staff/Marlene_Millan.webp",
            name: "Marlene Millan",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "PMHNP-BC",
        },
        {
            alt: "Glenna_Briney_LCSW",
            url: "/providers-and-staff",
            name: "Glenna Briney",
            title: "Psychotherapist",
            role: "provider",
            degree: "LCSW",
        },
        {
            alt: "Maria_Piedra_PhD",
            url: "/providers-and-staff/Maria_Piedra.webp",
            name: "Maria Piedra",
            title: "Psychologist",
            role: "provider",
            degree: "PhD",
        },
        // {
        //alt: "",
        // url: "/providers-and-staff",//
        // name: "Sarah Carter, PMHNP-BC",
        // 	title: "Psychiatric Nurse Practitioner",
        // 	role: "provider",
        // },
        {
            alt: "Yoggie_Effendy_PMHNP-BC",
            url: "/providers-and-staff",
            name: "Yoggie Effendy",
            title: "Psychiatric Nurse Practitioner",
            role: "provider",
            degree: "PMHNP-BC",
        },
        {
            alt: "Gina_Black",
            url: "/providers-and-staff/Gina_Black.webp",
            name: "Gina Black",
            title: "Apple Valley Office Manager",
            role: "staff",
            degree: "",
        },
        // {
        //alt: "",
        // url: "/providers-and-staff",//
        // name: "Elva McCallum",
        // 	title: "Blythe Office Manager",
        // 	role: "staff",
        // degree: "",
        // },
        {
            alt: "Sharon_Ravelo",
            url: "/providers-and-staff",
            name: "Sharon Ravelo",
            title: "Administrator",
            role: "staff",
            degree: "",
        },
        {
            alt: "Anwar_Farooqi_MBA",
            url: "/providers-and-staff/Anwar_Farooqi.webp",
            name: "Anwar Farooqi",
            title: "Administrative Assistant/HR Manager",
            role: "staff",
            degree: "MBA",
        },
        {
            alt: "Baybie_Scudder",
            url: "/providers-and-staff",
            name: "Baybie Scudder",
            title: "Operations Manager",
            role: "staff",
            degree: "",
        },
        {
            alt: "Arleen_Garcia_LVN",
            url: "/providers-and-staff",
            name: "Arlene Garcia, LVN",
            title: "Nurse",
            role: "staff",
            degree: "",
        },
        // {
        //alt: "",
        // url: "/providers-and-staff",//
        // name: "Stephanie Virgen-Rodriguez",
        // 	title: "Medical Assistant",
        // 	role: "staff",
        // degree: "",
        // },
        // alt: "",
        // url: "/providers-and-staff",// {
        // name: "Amber Armjio", tit
        // alt: "",le: "Medical Assistant", role: "staff" },
        // url: "/providers-and-staff",// {
        // name: "Sara Rivas", title: "Medical Assistant", role: "staff" },
        {
            alt: "Monique_Carlin",
            url: "/providers-and-staff",
            name: "Monique Carlin",
            title: "Loma Linda Office Manager",
            role: "staff",
            degree: "",
        },
        {
            alt: "Karen_Gonzales",
            url: "/providers-and-staff",
            name: "Karen Gonzalez",
            title: "Medical Assistant",
            role: "staff",
            degree: "",
        },
        {
            alt: "Kalee_Cautivar",
            url: "/providers-and-staff",
            name: "Kalee Cautivar",
            title: "Medical Assistant",
            role: "staff",
            degree: "",
        },
        {
            alt: "Marissa_Barrett",
            url: "/providers-and-staff",
            name: "Marissa Barrett",
            title: "Billing",
            role: "staff",
            degree: "",
        },
        {
            alt: "Alexix_Larios",
            url: "/providers-and-staff",
            name: "Alexis Larios",
            title: "Medical Assistant",
            role: "staff",
            degree: "",
        },
        {
            alt: "Selina_Felix",
            url: "/providers-and-staff",
            name: "Selina Felix",
            title: "Medical Assistant",
            role: "staff",
            degree: "",
        },
        {
            alt: "Arianna_Torres",
            url: "/providers-and-staff",
            name: "Ariana Torres",
            title: "Medical Assistant",
            role: "staff",
            degree: "",
        },
    ];

    const filteredStaff = staffMembers.filter(
        (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const providers = filteredStaff.filter(
        (member) => member.role === "provider"
    );
    const staff = filteredStaff.filter((member) => member.role === "staff");

    return (
        <div className="min-h-screen bg-blue-50 dark:bg-gray-900 py-12 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-300 mb-8 text-center">
                    Providers and Staff
                </h1>

                <div className="mb-8 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search providers and staff..."
                            className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute right-3 top-3 text-gray-400" />
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-4">
                        Providers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center align-items-center justify-items-center">
                        {providers.map((provider, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex items-center justify-start min-w-[20rem] sm:max-w-[20rem] md:min-w-[20rem] md:max-w-[20rem] lg:min-w-[20rem] lg:max-w-[20rem] xl:min-w-[25rem] xl:max-w-[25rem] 2xl:min-w-[25rem] 2xl:max-w-[29rem]"
                            >
                                <div className="flex items-center justify-start flex-row gap-5">
                                    <div className="size-full flex items-center justify-center">
                                        <div className="rounded-full border-[0.075rem] border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-400 h-[5rem] w-[5rem] flex items-center justify-center overflow-clip">
                                            {provider.url &&
                                            provider.url.length > 20 ? (
                                                <Image
                                                    src={provider.url}
                                                    alt={provider.alt}
                                                    height={50}
                                                    width={50}
                                                    className="rounded-full flex items-center justify-center size-full"
                                                />
                                            ) : (
                                                // <div className="size-full">
                                                <FaUserDoctor className="size-full" />
                                                // </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative flex items-end justify-center flex-col text-left w-full text-nowrap">
                                        <h3 className="lg:text-[0.95] md:text-[1rem] text-[0.9rem] font-semibold text-blue-900 dark:text-blue-300 size-full text-left">
                                            {provider.name}
                                        </h3>
                                        <h4 className="lg:text-[0.95] md:text-[0.9rem] text-[0.9rem] font-semibold text-blue-900 dark:text-blue-300 size-full text-left">
                                            {provider.degree}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 lg:text-[0.9rem] md:text-[0.9rem] text-[0.7rem] size-full text-left">
                                            {provider.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-4">
                        Office Staff
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center align-items-center justify-items-center">
                        {staff.map((staffMember, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex items-center justify-start min-w-[20rem] max-w-[20rem] sm:max-w-[20rem] md:min-w-[20rem] md:max-w-[20rem] lg:min-w-[24rem] lg:max-w-[24rem] xl:max-w-[28rem] 2xl:min-w-[29rem] 2xl:max-w-[29rem]"
                            >
                                <div className="flex items-center justify-start flex-row gap-5">
                                    <div className="size-full flex items-center justify-center">
                                        <div className="rounded-full border-[0.075rem] border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-400 h-[5rem] w-[5rem] flex items-center justify-center overflow-clip flex-1">
                                            {staffMember.url &&
                                            staffMember.url.length > 20 ? (
                                                <Image
                                                    src={staffMember.url}
                                                    alt={staffMember.alt}
                                                    height={50}
                                                    width={50}
                                                    className="rounded-full flex items-center justify-center size-full"
                                                />
                                            ) : (
                                                // <div className="size-full overflow-clip">
                                                <FaUser className="size-full" />
                                                // </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative flex items-end justify-center flex-col text-left w-full text-nowrap">
                                        <h3 className="lg:text-[0.95] md:text-[1rem] text-[0.9rem] font-semibold text-blue-900 dark:text-blue-300 size-full text-left">
                                            {staffMember.name}
                                        </h3>
                                        <h4 className="lg:text-[0.95] md:text-[0.9rem] text-[0.9rem] font-semibold text-blue-900 dark:text-blue-300 size-full text-left">
                                            {staffMember.degree}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 lg:text-[0.9rem] md:text-[0.9rem] text-[0.7rem] size-full text-left">
                                            {staffMember.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProvidersAndStaff;
