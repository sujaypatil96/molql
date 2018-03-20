/*
 * Copyright (c) 2017 MolQL contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import * as P from 'parsimmon'

import Expression from '../mini-lisp/expression'
// import Symbol from '../mini-lisp/symbol'

export interface AtomGroupArgs {
  [index: string]: any
  'entity-test'?: Expression
  'chain-test'?: Expression
  'residue-test'?: Expression
  'atom-test'?: Expression
  'groupBy'?: Expression
}

export interface Keyword {
  '@desc': string
  abbr?: string[]
  map?: () => Expression  // not given means the keyword is unsupported
}

export type KeywordDict = { [name: string]: Keyword }

// define the type for 'Command'
export interface Command {
    '@desc': string
    '@examples': string
    isUnsupported?: boolean     // supported or not
    name: string    // name of the PyMol command. Ex: 'select'
    map?: (args: Expression[]) => Expression     // mapping to convert o/p of Parsimmon parse tree to MolQL expression tree
}

export type CommandDict = { [name: string]: Command }

export interface Property {
  '@desc': string
  '@examples': string[]
  isUnsupported?: boolean
  isNumeric?: boolean
  abbr?: string[]
  regex: RegExp
  map: (s: string) => any
  level: 'atom-test' | 'residue-test' | 'chain-test' | 'entity-test'
  property?: any  // Symbol
}

export type PropertyDict = { [name: string]: Property }

export interface Operator {
  '@desc': string
  '@examples': string[]
  name: string
  abbr?: string[]
  isUnsupported?: boolean
  type: (p1: P.Parser<any>, p2: P.Parser<any>, fn: any) => P.Parser<any>
  rule: P.Parser<any>
  map: (x: any, y: any, z?: any) => Expression | Expression[]
}

export type OperatorList = Operator[]

export interface Function {
  '@desc': string
  '@examples': string[]
  map?: (x: any) => Expression  // not given means the keyword is unsupported
}

export type FunctionDict = { [name: string]: Function }
