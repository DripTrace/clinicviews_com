// // src/components/FSClinicals/FSClinicalsFooter.tsx
// "use client"

// import React from 'react';
// import { useSelector } from 'react-redux';
// import { FSClinicalsRootState } from '@/store/fsclinicalsStore';

// const FSClinicalsFooter: React.FC = () => {
//   const isDarkMode = useSelector((state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode);

//   return (
//     <footer className={`${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-800 text-white'} p-8`}>
//       <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div>
//           <h3 className="text-xl font-bold mb-4">Four Square Clinicals</h3>
//           <p>Innovative strategies for achieving health</p>
//         </div>
//         <div>
//           <h3 className="text-xl font-bold mb-4">Contact Us</h3>
//           <p>Email: <a href="mailto:info@fsclinicals.com" className="hover:text-blue-300 transition-colors cursor-pointer">info@fsclinicals.com</a></p>
//           <p>Phone: <a href="tel:775-238-3082" className="hover:text-blue-300 transition-colors cursor-pointer">775-238-3082</a></p>
//         </div>
//         <div>
//           <h3 className="text-xl font-bold mb-4">Locations</h3>
//           <p>California: 650 N Rose Drive #472, Placentia, CA 92870</p>
//           <p>Nevada: 100 N Arlington Ave, Suite 340A, Reno, NV 89501</p>
//         </div>
//       </div>
//       <div className="mt-8 text-center">
//         <p>&copy; 2024 by FS Clinicals. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// export default FSClinicalsFooter;


"use client"

import React from 'react';
import { useSelector } from 'react-redux';
import { FSClinicalsRootState } from '@/store/fsclinicalsStore';

const FSClinicalsFooter: React.FC = () => {
  const isDarkMode = useSelector((state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode);

  return (
    <footer className={`${isDarkMode ? 'bg-[#0C3C60] text-[#D1E0EB]' : 'bg-[#494949] text-white'} p-8`}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Four Square Clinicals</h3>
          <p>Innovative strategies for achieving health</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p>Email: <a href="mailto:info@fsclinicals.com" className="hover:text-[#1FABC7] transition-colors cursor-pointer">info@fsclinicals.com</a></p>
          <p>Phone: <a href="tel:775-238-3082" className="hover:text-[#1FABC7] transition-colors cursor-pointer">775-238-3082</a></p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Locations</h3>
          <p>California: <a href="https://goo.gl/maps/XXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-[#1FABC7] transition-colors">650 N Rose Drive #472, Placentia, CA 92870</a></p>
          <p>Nevada: <a href="https://goo.gl/maps/YYYYYY" target="_blank" rel="noopener noreferrer" className="hover:text-[#1FABC7] transition-colors">100 N Arlington Ave, Suite 340A, Reno, NV 89501</a></p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p>&copy; 2024 by FS Clinicals. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FSClinicalsFooter;