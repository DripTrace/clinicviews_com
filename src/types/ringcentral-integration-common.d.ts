// declare module "@ringcentral-integration/commons/modules/ActiveCallControl" {
//     export interface Session {
//         // Add properties that you know exist on the Session interface
//         // For example:
//         id: string;
//         // Add other properties as needed
//     }

//     export interface WebPhoneSession extends Session {
//         // Add properties specific to WebPhoneSession
//         // For example:
//         accept: () => Promise<void>;
//         terminate: () => Promise<void>;
//         // Add other properties as needed
//     }

//     // If there are other exports from this module, declare them here
// }

// declare module "@ringcentral-integration/commons/modules/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/commons/modules/ActiveCallControl" {
//     export interface Session {
//         // Add known properties of Session
//         id: string;
//         // Add other properties as needed
//     }

//     export interface WebPhoneSession extends Session {
//         // Add known properties specific to WebPhoneSession
//         accept(): Promise<void>;
//         terminate(): Promise<void>;
//         // Add other properties as needed
//     }

//     // Add other exports from this module if there are any
// }

// // More general declaration for other modules
// declare module "@ringcentral-integration/commons/modules/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/commons/modules/ActiveCallControl" {
//     export const Session: any;
//     export const WebPhoneSession: any;
//     // other exports...
// }

// declare module "@ringcentral-integration/commons/modules/ActiveCallControl" {
//     export class Session {
//         id: string;
//         // Add other properties as needed
//     }

//     export class WebPhoneSession extends Session {
//         accept(): Promise<void>;
//         terminate(): Promise<void>;
//         // Add other properties and methods as needed
//     }

//     // Add other exports from this module if there are any
// }

// // More general declaration for other modules
// declare module "@ringcentral-integration/commons/modules/*" {
//     const content: any;
//     export = content;
// }

// declare module "@ringcentral-integration/commons/modules/ActiveCallControl" {
//     export class Session {
//         id: string;
//         // Add other known properties
//     }

//     export class WebPhoneSession extends Session {
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

export default {};
