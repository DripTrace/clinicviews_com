// declare module "@ringcentral-integration/utils" {
//     export function getTranslateFn(): any; // Update this based on actual type if you know it
// }

// declare module "@ringcentral-integration/utils" {
//     const content: any;
//     export = content;
// }

declare module "@ringcentral-integration/utils" {
    export function getTranslateFn(i18n: any): (...args: any[]) => string;
    // Add other functions or types from the package as needed
}
