import Symbols, { SymbolInfo } from '../language/symbols'
import * as Query from './query'
import * as RuntimeHelpers from './helpers/runtime'
import * as QueryHelpers from './helpers/query'

export type RuntimeExpression<T = any> = (ctx: Query.Context, ...args: RuntimeExpression[]) => T

const symbols: [SymbolInfo, RuntimeExpression][] = [
    ////////////////////////////////////
    // Primitives
    [Symbols.primitive.constructor.list, (ctx, ...xs) => {
        const list: any[] = [];
        for (const x of xs) list[list.length] = x(ctx);
        return list;
    }],
    [Symbols.primitive.constructor.set, (ctx, ...xs) => {
        const set = new Set<any>();
        for (const x of xs) set.add(x(ctx));
        return set;
    }],
    [Symbols.primitive.constructor.map, (ctx, ...xs) => {
        const map = new Map<any, any>();
        for (let i = 0; i < xs.length; i += 2) map.set(xs[i](ctx), xs[i + 1](ctx));
        return map;
    }],

    [Symbols.primitive.operator.not, (ctx, x) => !x(ctx)],
    [Symbols.primitive.operator.and, (ctx, ...xs) => {
        for (const x of xs) if (!x(ctx)) return false;
        return true;
    }],
    [Symbols.primitive.operator.or, (ctx, ...xs) => {
        for (const x of xs) if (x(ctx)) return true;
        return false;
    }],
    [Symbols.primitive.operator.eq, (ctx, x, y) => x(ctx) === y(ctx)],
    [Symbols.primitive.operator.neq, (ctx, x, y) => x(ctx) !== y(ctx)],
    [Symbols.primitive.operator.lt, (ctx, x, y) => x(ctx) < y(ctx)],
    [Symbols.primitive.operator.lte, (ctx, x, y) => x(ctx) <= y(ctx)],
    [Symbols.primitive.operator.gr, (ctx, x, y) => x(ctx) > y(ctx)],
    [Symbols.primitive.operator.gre, (ctx, x, y) => x(ctx) >= y(ctx)],
    [Symbols.primitive.operator.plus, (ctx, ...xs) => {
        let ret = 0;
        for (const x of xs) ret += x(ctx);
        return ret;
    }],
    [Symbols.primitive.operator.div, (ctx, x, y) => x(ctx) / y(ctx)],
    [Symbols.primitive.operator.inRange, (ctx, x, a, b) => { const v = x(ctx); return v >= a(ctx) && v <= b(ctx) }],

    ////////////////////////////////////
    // Structure
    [Symbols.structure.constructor.elementSymbol, (ctx, s: RuntimeExpression<string>) => RuntimeHelpers.normalizeElementSymbol(s(ctx))],

    [Symbols.structure.property.atom.id, ctx => ctx.columns.id.getInteger(ctx.element.current.atom)],
    [Symbols.structure.property.atom.label_atom_id, ctx => ctx.columns.label_asym_id.getString(ctx.element.current.atom)],
    [Symbols.structure.property.atom.type_symbol, ctx => RuntimeHelpers.normalizeElementSymbol(ctx.columns.type_symbol.getString(ctx.element.current.atom))],
    [Symbols.structure.property.atom.B_iso_or_equiv, ctx => ctx.columns.B_iso_or_equiv.getFloat(ctx.element.current.atom)],
    [Symbols.structure.property.residue.uniqueId, ctx => ctx.element.current.residue],
    [Symbols.structure.property.residue.label_comp_id, ctx => ctx.columns.label_comp_id.getString(ctx.element.current.atom)],
    [Symbols.structure.property.residue.label_seq_id, ctx => ctx.columns.label_seq_id.getInteger(ctx.element.current.atom)],
    [Symbols.structure.property.chain.label_asym_id, ctx => ctx.columns.label_asym_id.getString(ctx.element.current.atom)],

    [Symbols.structure.property.atomSet.atomCount, ctx => ctx.atomSet.current.atomIndices.length],
    [Symbols.structure.property.atomSet.accumulate.foldl, (ctx, f: RuntimeExpression<any>, initial: RuntimeExpression<any>) => {
        const iterator = ctx.value;
        Query.Iterator.begin(ctx.element, Query.Iterator.Element());
        Query.Iterator.begin(iterator, void 0);
        iterator.current = initial(ctx);
        for (const atom of ctx.atomSet.current.atomIndices) {
            Query.Iterator.setAtomElement(ctx, atom);
            iterator.current = f(ctx);
        }
        const reduced = iterator.current;
        Query.Iterator.end(iterator);
        Query.Iterator.end(ctx.element);
        return reduced;
    }],
    [Symbols.structure.property.atomSet.accumulate.value, ctx => ctx.value.current],
    [Symbols.structure.property.atomSetSeq.length, (ctx, seq: RuntimeExpression<Query.AtomSetSeq>) => seq(ctx).atomSets.length],

    [Symbols.structure.primitive.generate, (ctx, pred: RuntimeExpression<boolean>, grouping?: RuntimeExpression) => {
        if (grouping) return RuntimeHelpers.groupingGenerator(ctx, pred, grouping);
        return RuntimeHelpers.nonGroupingGenerator(ctx, pred);
    }],
    [Symbols.structure.primitive.modify, (ctx, seq: RuntimeExpression<Query.AtomSetSeq>, f: RuntimeExpression<Query.AtomSetSeq>) => {
        const result = new QueryHelpers.HashAtomSetSeqBuilder(ctx);
        const iterator = ctx.atomSet;
        Query.Iterator.begin(iterator, void 0);
        for (const src of seq(ctx).atomSets) {
            iterator.current = src;
            for (const set of f(ctx).atomSets) {
                result.add(set);
            }
        }
        Query.Iterator.end(iterator);
        return result.getSeq();
    }],
    [Symbols.structure.primitive.inContext, (ctx, newCtx: RuntimeExpression<Query.Context>, query: RuntimeExpression<Query.AtomSetSeq>) => {
        if (ctx.element.current || ctx.atomSet.current) throw new Error('Context cannot be changed inside a generator or modifier query.');
        return query(newCtx(ctx));
    }],
    [Symbols.structure.modifier.filter, (ctx, pred: RuntimeExpression<boolean>) => {
        if (pred(ctx)) return Query.AtomSetSeq(ctx, [ctx.atomSet.current]);
        return Query.AtomSetSeq(ctx, []);
    }],
];

const table = (function () {
    const table: { [name: string]: RuntimeExpression } = {};
    for (const s of symbols) {
        table[s[0].name] = s[1];
    }
    return table;
})();

export default table;