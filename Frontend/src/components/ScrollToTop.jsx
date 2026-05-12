import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    useEffect(() => {
        if (hash) return undefined;

        let secondFrameId;
        const firstFrameId = window.requestAnimationFrame(() => {
            secondFrameId = window.requestAnimationFrame(() => {
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            });
        });

        return () => {
            window.cancelAnimationFrame(firstFrameId);
            if (secondFrameId) window.cancelAnimationFrame(secondFrameId);
        };
    }, [pathname, hash]);

    return null;
}
