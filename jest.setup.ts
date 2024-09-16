import "@testing-library/jest-dom";

Object.defineProperty(global, "navigator", {
    value: {
        userAgent: "",
    },
    writable: true,
});

// Add any other global mocks here
