/*
 * Copyright (c) 2017 MolQL contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import Compiler, { CompiledExpression } from '../mini-lisp/compiler'
import Context from './runtime/context'
import Expression from '../../mini-lisp/expression'
import { SymbolMap } from '../../molql/symbol-table'
import typeChecker from './type/checker'
import Environment from './runtime/environment'

export type Compiled<T = any> = CompiledExpression<Context, T>
const _compile = Compiler<Context>(SymbolMap, Environment);

export default function compile<T = any>(e: Expression) {
    typeChecker(SymbolMap, e);
    return _compile<T>(e);
}