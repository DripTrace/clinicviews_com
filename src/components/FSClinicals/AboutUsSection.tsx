// "use client"

// import React from 'react';
// import { motion } from 'framer-motion';
// import { useSelector } from 'react-redux';
// import { FSClinicalsRootState } from '@/store/fsclinicalsStore';
// import dynamic from 'next/dynamic';

// const ChevronDown = dynamic(() => import('lucide-react').then((mod) => mod.ChevronDown), { ssr: false });

// const AboutUsSection: React.FC = () => {
//   const isDarkMode = useSelector((state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode);

//   return (
//     <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} py-16`}>
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-lg p-8`}
//         >
//           <p className="mb-4">
//             Four Square (FS) Clinicals offers direct client services from psychiatric evaluations and
//             substance abuse treatments to clinical research, practice management, and administrative support.
//             We utilize our resources to help identify and improve patient care.
//           </p>
//           <p className="mb-4">
//             FS Clinicals provides support in private, non-profit, government agencies and clinical research.
//             We strive to build lasting relationships in order to address patient needs by utilizing our
//             patient centered approach and collaborations for &ldquo;whole patient&ldquo; health.
//           </p>
//           <p>
//             From the private sector to community programs, we have been able to connect and build a
//             well-rounded support that has been lacking in mental health services. Our integrated team of
//             experts has allowed us to reach out to those who have been lost in the disparities of healthcare
//             systems.
//           </p>
//           <motion.a
//             href="#"
//             className={`inline-block mt-6 ${isDarkMode ? 'text-blue-300 hover:text-blue-400' : 'text-blue-500 hover:text-blue-700'} transition-colors cursor-pointer select-auto`}
//             whileHover={{ x: 5 }}
//           >
//             Read More <ChevronDown size={16} className="inline" />
//           </motion.a>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default AboutUsSection;

"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FSClinicalsRootState } from '@/store/fsclinicalsStore';
import dynamic from 'next/dynamic';

const ChevronDown = dynamic(() => import('lucide-react').then((mod) => mod.ChevronDown), { ssr: false });

const AboutUsSection: React.FC = () => {
  const isDarkMode = useSelector((state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode);

  return (
    <section className={`${isDarkMode ? 'bg-[#0C3C60]' : 'bg-[#D1E0EB]'} py-16`}>
      <div className="container mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-[#D1E0EB]' : 'text-[#0C3C60]'}`}>About Us</h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={`${isDarkMode ? 'bg-[#494949] text-[#D1E0EB]' : 'bg-white text-[#494949]'} rounded-lg shadow-lg p-8`}
        >
          <p className="mb-4">
            Four Square (FS) Clinicals offers direct client services from psychiatric evaluations and
            substance abuse treatments to clinical research, practice management, and administrative support.
            We utilize our resources to help identify and improve patient care.
          </p>
          <p className="mb-4">
            FS Clinicals provides support in private, non-profit, government agencies and clinical research.
            We strive to build lasting relationships in order to address patient needs by utilizing our
            patient centered approach and collaborations for &rdquo;whole patient&rdquo; health.
          </p>
          <p>
            From the private sector to community programs, we have been able to connect and build a
            well-rounded support that has been lacking in mental health services. Our integrated team of
            experts has allowed us to reach out to those who have been lost in the disparities of healthcare
            systems.
          </p>
          <motion.a
            href="#"
            className={`inline-block mt-6 ${isDarkMode ? 'text-[#1FABC7] hover:text-[#6EA4CE]' : 'text-[#6EA4CE] hover:text-[#1FABC7]'} transition-colors cursor-pointer select-auto`}
            whileHover={{ x: 5 }}
          >
            Read More <ChevronDown size={16} className="inline" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsSection;