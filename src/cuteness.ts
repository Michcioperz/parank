import { AnimationConfig, flip } from "svelte/animate";

export function flipDuration(distance: number): number {
    // TODO: figure out something cute!
    return Math.sqrt(distance) * 120;
}

export function cuteFlip(node: Element, { from, to }: { from: DOMRect, to: DOMRect }, _params?: any): AnimationConfig {
    const sup = flip(node, { from, to }, { duration: flipDuration });
    const goingUp = to.top < from.top;
    const extraCss = goingUp ? "z-index: 5;" : "";
    const css = (t, u) => {
        return sup.css(t, u) + extraCss
    };
    return { ...sup, css };
}