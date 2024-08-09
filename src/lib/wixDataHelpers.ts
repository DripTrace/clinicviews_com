// // lib/wixDataHelpers.ts
// // import { wixClient } from "./wixClient";

// import { wixClient } from "./wixClient";

// export const insertPatientRegistration = async (data: any) => {
//     try {
//         const response = await wixClient.data.bulkInsert(
//             "PatientRegistrations",
//             [data]
//         );
//         return response;
//     } catch (error) {
//         console.error("Error inserting data into Wix:", error);
//         throw new Error("Failed to insert data into Wix");
//     }
// };
