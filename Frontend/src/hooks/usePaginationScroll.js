import { useEffect, useRef } from "react";

export default function usePaginationScroll(dependencies, targetRef) {
    const skipInitialScrollRef = useRef(true);

    useEffect(() => {
        if (skipInitialScrollRef.current) {
            skipInitialScrollRef.current = false;
            return undefined;
        }

        const frameId = window.requestAnimationFrame(() => {
            if (targetRef?.current) {
                targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }

            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        });

        return () => window.cancelAnimationFrame(frameId);
    }, dependencies);
}
