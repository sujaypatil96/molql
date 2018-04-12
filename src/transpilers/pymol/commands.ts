// // map the PyMol command to your MolQL symbols here

import { CommandDict } from '../types'
import B from '../../molql/builder'
// import * as h from '../helper'

// const reFloat = /[-+]?[0-9]*\.?[0-9]+/
// const rePosInt = /[0-9]+/

function atomListMap(x: string) { return x.split('+').map(B.rand) }

// function atomNameListMap(x: string) { return x.split('+').map(B.atomName) }

function listMap(x: string) { return x.split('+').map(x => x.replace(/^["']|["']$/g, '')) }

// function atomListMap(x: string[]) {
//     x.forEach(x => {
//         return x.split(' ').map(B.atomName)
//     })
// }

// function rangeMap(x: string) {
//   const [min, max] = x.split('-').map(x => parseInt(x))
//   return {min, max}
// }
// function listOrRangeMap(x: string) {
//   return x.includes('-') ? rangeMap(x) : listMap(x).map(x => parseInt(x))
// }

const commands: CommandDict = {
    // perhaps using atomGroups() or any other symbols
    select: {
      '@desc': 'select atom-groups based on selection expression with appropriate property selector (name).',
      abbr: ['select'],
      regex: /[a-zA-Z '"+]+/,
      map: atomListMap,
      level: 'atom-test',
      property: B.ammp('label_atom_id')
    },

    "select resn": {
      '@desc': 'select atom-groups based on selection expression with appropriate property selector (resn).',
      abbr: ['select resn'],
      regex: /[a-zA-Z'"+]+/,
      map: listMap,
      level: 'residue-test',
      property: B.ammp('label_comp_id')
    }

}

export default commands
