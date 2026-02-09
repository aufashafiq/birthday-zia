"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollFadeOptions {
    threshold?: number;
    rootMargin?: string;
}

export function useScrollFade<T extends HTMLElement>(
    options: UseScrollFadeOptions = {}
) {
    const { threshold = 0.2, rootMargin = "0px" } = options;
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin]);

    return { ref, isVisible };
}

export function useMultipleScrollFade<T extends HTMLElement>(
    count: number,
    options: UseScrollFadeOptions = {}
) {
    const { threshold = 0.2, rootMargin = "0px" } = options;
    const refs = useRef<(T | null)[]>([]);
    const [visibleItems, setVisibleItems] = useState<boolean[]>(
        new Array(count).fill(false)
    );

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        refs.current.forEach((element, index) => {
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    setVisibleItems((prev) => {
                        const newState = [...prev];
                        newState[index] = entry.isIntersecting;
                        return newState;
                    });
                },
                {
                    threshold,
                    rootMargin,
                }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [count, threshold, rootMargin]);

    const setRef = (index: number) => (el: T | null) => {
        refs.current[index] = el;
    };

    return { setRef, visibleItems };
}
