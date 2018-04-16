// // map the PyMol command to your MolQL symbols here

import { CommandDict } from '../types'
import B from '../../molql/builder'
// import Expression from '../../../src/mini-lisp/expression'
// import * as h from '../helper'

// const reFloat = /[-+]?[0-9]*\.?[0-9]+/
// const rePosInt = /[0-9]+/

function cmdListMap(x: string) { return x.split('+').map(B.select_handler) }

function prop(x: string) {
    var name_re = /name\s+[a-zA-Z+ ]+/

    if (x.match(name_re)) {
        console.log(x.match(name_re))
        return B.ammp('label_atom_id')
    } else {
        return B.ammp('label_seq_id')
    }
}

// function atomNameListMap(x: string) { return x.split('+').map(B.atomName) }

// function listMap(x: string) { return x.split('+').map(x => x.replace(/^["']|["']$/g, '')) }

// function cmdListMap(x: string[]) {
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
    select: {
      '@desc': 'select atom-groups based on selection expression with appropriate property selector (name/resn/resi/ss).',
      abbr: ['select'],
      regex: /[a-zA-Z '"+]+/,
      map: cmdListMap,
      level: 'atom-test',
      property: prop
    }
}

export default commands
