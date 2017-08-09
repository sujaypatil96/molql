/*
 * Copyright (c) 2017 David Sehnal, licensed under MIT, See LICENSE file for more info.
 */

import Type from '../../mini-lisp/type'

export default function format(type: Type): string {
    switch (type.kind) {
        case 'any': return 'Any';
        case 'value': return type.name;
        case 'variable': return type.type && type.type.kind !== 'any' ? `${type.name}<${format(type.type)}>` : type.name;
        case 'container': return `${type.name}[${format(type.child)}]`;
        case 'union': return type.types.map(format).join(' | ')
        default: throw new Error(`unknown type kind`);
    }
}