/*
 * Copyright (c) 2017 MolQL contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import * as P from 'parsimmon'

import * as h from '../helper'
import { OperatorList } from '../types'
import B from '../../molql/builder'
// import Expression from '../../mini-lisp/expression'

const operators: OperatorList = [
  {
    '@desc': 'Selects atoms that are not included in s1.',
    '@examples': ['not protein'],
    name: 'not',
    type: h.prefix,
    rule: P.alt(P.regex(/NOT/i).skip(P.whitespace), P.string('!').skip(P.optWhitespace)),
    map: (op, selection) => h.invertExpr(selection),
  },
  {
    '@desc': 'Selects atoms included in both s1 and s2.',
    '@examples': ['backbone and protein'],
    name: 'and',
    type: h.binaryLeft,
    rule: h.infixOp(/AND|&/i),
    map: (op, selection, by) => B.struct.modifier.intersectBy({ 0: selection, by })
  },
  {
    '@desc': 'Selects atoms included in either s1 or s2.',
    '@examples': ['water or protein'],
    name: 'or',
    type: h.binaryLeft,
    rule: h.infixOp(/OR|\|/i),
    map: (op, s1, s2) => B.struct.combinator.merge([s1, s2])
  }
  // within  str  selects atoms within a specified distance of a selection (i.e within 5 of name FE).
  // exwithin  str  exclusive within, equivalent to (within 3 of X) and not X.
  // same  str  selects atoms which have the same keyword as the atoms in a given selection (i.e. same segname as resid 35)
]

export default operators
