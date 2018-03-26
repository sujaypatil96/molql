// // map the PyMol command to your MolQL symbols here

import { CommandDict } from '../types'
import B from '../../molql/builder'
// import * as h from '../helper'

const commands: CommandDict = {
  // perhaps using atomGroups() or any other symbols
    select: {
        '@desc' : 'selection of atoms depending on the selection-expression',
        '@examples' : ['select near142, resi 142 around 5'],
        name : 'select',
        map: () => B.struct.generator.atomGroups()  // random implementation for now
    },
    show: {
      '@desc' : 'specify the representation for the current selection',
      '@examples' : ['show ribbon'],
      name : 'show',
      map: () => B.struct.generator.nthRes()  // random implementation for now
    }
}

export default commands
