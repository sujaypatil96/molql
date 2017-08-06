/*
 * Copyright (c) 2017 David Sehnal, licensed under MIT, See LICENSE file for more info.
 */

import MolQL from '../../mol-ql/symbols'
import Symbol, { isSymbol, Arguments, Argument } from '../../mini-lisp/symbol'

/**
 * Generates markdown documentation from the language spec.
 */

function _getDocs(includeToC: boolean) {
    const ToC: string[] = [`
Language Reference
==================

`];
    const implemented: string[] = []

    // const notImplemented: string[] = [`
    // Not yet implemented
    // ===================
    // `
    // ]

    function formatArgs(args: Arguments) {
        if (args.kind === 'list') {
            return `array [\n  ${args.type.name}${args.nonEmpty ? '+' : '*'}\n]`;
        }
        const map = args.map;
        const keys = Object.keys(map);
        const formatted: string[] = [];

        if (!keys.length) return '()\n  '

        let isArgArray = true, argIndex = 0;
        for (const key of keys) {
            if (isNaN(key as any) || +key !== argIndex) {
                isArgArray = false;
                break;
            }
            argIndex++;
        }

        formatted.push(isArgArray ? 'array [\n' : 'object {\n');
        argIndex = 0;

        for (const key of keys) {
            const arg = (map as any)[key] as Argument<any>;
            if (!isNaN(key as any)) {
                formatted.push(`  ${arg.isOptional ? '?' : ''}${arg.type.name}${arg.isRest ? '*' : ''}`);
            } else {
                formatted.push(`  ${key}${arg.isOptional ? '?:' : ':'} ${arg.type.name}${arg.isRest ? '*' : ''}`);
            }
            if (arg.defaultValue !== void 0) formatted.push(` = ${arg.defaultValue}`);
            if (arg.description !== void 0) formatted.push(` (* ${arg.description} *)`);
            if (argIndex < keys.length - 1) formatted.push(', ')
            formatted.push('\n');
            argIndex++;
        }
        formatted.push(isArgArray ? ']' : '}')
        return formatted.join('');
    }

    function formatSymbol(symbol: Symbol, lines: string[]) {
        const info = symbol.info;
        const header = `${symbol.id} :: ${formatArgs(symbol.args)} => ${symbol.type.name}`
        lines.push(`### **${symbol.info.name}**`);
        lines.push(`\`\`\`\n${header}\n\`\`\`\n`);
        if (info.description) {
            lines.push(`*${info.description}*\n`);
        }
    }

    function format(depth: number, obj: any) {
        if (isSymbol(obj)) {
            formatSymbol(obj, implemented);
            return;
        }
        if (obj['@header']) {
            implemented.push(`${depth >= 2 ? '##' : '#'} ${obj['@header']}\n`);
            implemented.push(`-------------------\n`);
            const tocLink = obj['@header'].toLowerCase().replace(/\s/g, '-');
            ToC.push(`${new Array(depth + 1).join('  ')} * [${obj['@header']}](#${tocLink})`);
        }
        for (const childKey of Object.keys(obj)) {
            if (typeof obj[childKey] !== 'object' && !isSymbol(obj[childKey])) continue;
            format(depth + 1, obj[childKey]);
        }
    }
    format(0, MolQL);

    const docs = (includeToC ? ToC.join('\n') + '\n' : '') + implemented.join('\n');
    return docs;
}

let md: string | undefined = void 0;

export default function getDocs(includeToC = true) {
    if (md) return md;
    md = _getDocs(includeToC);
    return md;
}

if (typeof process !== void 0 && process.argv[2] === '-print') {
    console.log(getDocs());
}