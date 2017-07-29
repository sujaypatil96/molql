/*
 * Copyright (c) 2017 David Sehnal, licensed under MIT, See LICENSE file for more info.
 */

import { FastSet } from './collections'

interface Mask {
    size: number;
    has(i: number): boolean;
}

namespace Mask {
    class EmptyMask implements Mask {
        size = 0;
        has(i: number) { return false; }
        constructor() { }
    }

    class SingletonMask implements Mask {
        size = 1;
        has(i: number) { return i === this.idx; }
        constructor(private idx: number) { }
    }

    class BitMask implements Mask {
        private length: number;
        has(i: number) { return i < this.length && !!this.mask[i] as any; }
        constructor(private mask: number[], public size: number) { this.length = mask.length;  }
    }

    class AllMask implements Mask {
        has(i: number) { return true; }
        constructor(public size: number) { }
    }

    export function always(size: number) { return new AllMask(size); }
    export const never = new EmptyMask();

    export function ofSet(set: FastSet<number>): Mask {
        return set;
    }

    export function ofUniqueIndices(totalCount: number, indices: ArrayLike<number>): Mask {
        const len = indices.length;
        if (len === 0) return new EmptyMask();
        if (len === 1) return new SingletonMask(indices[0]);
        if (len === totalCount) return new AllMask(len);

        const f = len / totalCount;
        if (f < 1 / 12) {
            const set = FastSet.create();
            for (const i of (indices as number[])) set.add(i);
            return set;
        }

        const mask = new Int8Array(totalCount);
        let size = 0;
        for (const i of (indices as number[])) {
            mask[i] = 1;
        }
        return new BitMask(mask as any, indices.length);
    }

    export function ofMask(mask: number[], size: number): Mask {
        return new BitMask(mask, size);
    }

    export function hasAny(mask: Mask, xs: number[]) {
        for (const x of xs) {
            if (mask.has(x)) return true;
        }
        return false;
    }
}

export default Mask;