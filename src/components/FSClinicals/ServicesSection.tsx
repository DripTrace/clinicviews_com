// // src/components/FSClinicals/Home/ServicesSection.tsx
// "use client"

// import React from 'react';
// import { motion } from 'framer-motion';
// import { useSelector } from 'react-redux';
// import { FSClinicalsRootState } from '@/store/fsclinicalsStore';

// const services = [
//   {
//     title: "Patients",
//     description: "We assist with mental illness, drugs and alcohol, building a positive and successful contribution to self, others and society in an outpatient setting."
//   },
//   {
//     title: "Collaborations",
//     description: "Our focus is to provide cost-effective, quality treatment through a hybrid model of Health Services. We help identify and bridge the gaps in healthcare services to improve quality of life."
//   },
//   {
//     title: "Affiliates",
//     description: "Four Square Clinicals consists of four branches: Clinical Practice, Research, Housing and Philanthropy. Our objectives include community outreach, job placement, improved skill-sets, and continuing care."
//   }
// ];

// const ServicesSection: React.FC = () => {
//   const isDarkMode = useSelector((state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode);

//   return (
//     <section className="py-16">
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {services.map((service, index) => (
//             <motion.div
//               key={service.title}
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 * index }}
//               className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow`}
//             >
//               <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
//               <p className="mb-4">{service.description}</p>
//               <a href="#" className={`${isDarkMode ? 'text-blue-300 hover:text-blue-400' : 'text-blue-500 hover:text-blue-700'} transition-colors cursor-pointer select-auto`}>
//                 Learn More
//               </a>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ServicesSection;


"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FSClinicalsRootState } from '@/store/fsclinicalsStore';

const services = [
  {
    title: "Patients",
    description: "We assist with mental illness, drugs and alcohol, building a positive and successful contribution to self, others and society in an outpatient setting."
  },
  {
    title: "Collaborations",
    description: "Our focus is to provide cost-effective, quality treatment through a hybrid model of Health Services. We help identify and bridge the gaps in healthcare services to improve quality of life."
  },
  {
    title: "Affiliates",
    description: "Four Square Clinicals consists of four branches: Clinical Practice, Research, Housing and Philanthropy. Our objectives include community outreach, job placement, improved skill-sets, and continuing care."
  }
];

const ServicesSection: React.FC = () => {
  const isDarkMode = useSelector((state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode);

  return (
    <section className="py-16 bg-[#D1E0EB]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#0C3C60]">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              className={`${isDarkMode ? 'bg-[#0C3C60] text-[#D1E0EB]' : 'bg-white text-[#494949]'} rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow`}
            >
              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="mb-4">{service.description}</p>
              <a href="#" className={`${isDarkMode ? 'text-[#1FABC7] hover:text-[#6EA4CE]' : 'text-[#6EA4CE] hover:text-[#1FABC7]'} transition-colors cursor-pointer select-auto`}>
                Learn More
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;