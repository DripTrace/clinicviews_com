import imagesLoaded from "imagesloaded";
import WebFont from "webfontloader";

export const preloadImages = (selector: string = "img"): Promise<void> => {
    return new Promise<void>((resolve) => {
        imagesLoaded(
            document.querySelectorAll(selector),
            { background: true },
            () => resolve()
        );
    });
};

export const preloadFonts = (id: string): Promise<void> => {
    return new Promise((resolve) => {
        WebFont.load({
            typekit: {
                id: id,
            },
            active: resolve,
            inactive: resolve, // Add this to ensure the promise resolves even if fonts fail to load
        });
    });
};
