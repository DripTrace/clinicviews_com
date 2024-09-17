// declare module "@ringcentral-integration/utils" {
//     export function getTranslateFn(): any; // Update this based on actual type if you know it
// }

// declare module "@ringcentral-integration/utils" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/utils" {
//     export function getTranslateFn(i18n: any): (...args: any[]) => string;
//     // Add other functions or types from the package as needed
// }

// ringcentral-integration.d.ts

// declare module "@ringcentral-integration/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/commons/modules/ActiveCallControl" {
//     export interface Session {
//         id: string;
//         // Add other known properties
//     }

//     export interface WebPhoneSession extends Session {
//         accept(): Promise<void>;
//         terminate(): Promise<void>;
//         // Add other known methods and properties
//     }

//     // Add other known exports
// }

// declare module "@ringcentral-integration/utils" {
//     export function getTranslateFn(i18n: any): (...args: any[]) => string;
//     // Add other known exports
// }

// // General catch-all for other modules
// declare module "@ringcentral-integration/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/commons/enums/telephonySessionStatus" {
//     export enum telephonySessionStatus {
//         // Add the actual enum values here. For example:
//         Proceeding = "Proceeding",
//         Connecting = "Connecting",
//         Connected = "Connected",
//         Disconnected = "Disconnected",
//         // Add any other values that are part of this enum
//     }
// }

// // Keep your existing declarations
// declare module "@ringcentral-integration/commons/modules/ActiveCallControl" {
//     // ... (keep your existing declarations for this module)
// }

// declare module "@ringcentral-integration/utils" {
//     // ... (keep your existing declarations for this module)
// }

// // General catch-all for other modules
// declare module "@ringcentral-integration/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/commons/enums/telephonySessionStatus" {
//     export const telephonySessionStatus: any;
// }

// ... keep your existing declarations

// declare module "@ringcentral-integration/commons/lib/callLogHelpers" {
//     export function getWebphoneSessionDisplayName(session: any): string;
//     export function isInbound(session: any): boolean;
//     export function isRinging(session: any): boolean;
//     // Add any other functions exported from this module
// }

// // ... keep your existing declarations

// // Update the catch-all declaration to be more specific
// declare module "@ringcentral-integration/commons/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/commons/lib/callLogHelpers" {
//     export const getWebphoneSessionDisplayName: any;
//     export const isInbound: any;
//     export const isRinging: any;
//     // Add any other exported functions here
// }

// declare module "@ringcentral-integration/commons/enums/telephonySessionStatus" {
//     export enum telephonySessionStatus {
//         // Add the actual enum values here. For example:
//         Proceeding = "Proceeding",
//         Connecting = "Connecting",
//         Connected = "Connected",
//         Disconnected = "Disconnected",
//         // Add any other values that are part of this enum
//     }
// }

// declare module "@ringcentral-integration/commons/lib/callLogHelpers" {
//     export function getWebphoneSessionDisplayName(session: any): string;
//     export function isInbound(session: any): boolean;
//     export function isRinging(session: any): boolean;
//     // Add any other functions exported from this module
// }

// // Keep your existing declarations for other modules

// // Update the catch-all declaration to be more specific
// declare module "@ringcentral-integration/commons/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/commons/modules/ActiveCallControl" {
//     export const isHolding: any;
//     // Add any other exports as needed
// }

export default {};
