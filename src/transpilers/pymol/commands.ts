// // map the PyMol command to your MolQL symbols here

import { CommandDict } from '../types'
import B from '../../molql/builder'
// import * as h from '../helper'

const commands: CommandDict = {
    select: {
        // code
        // perhaps using atomGroups() or any other symbols
        '@desc' : 'selection of atoms depending on the selection-expression',
        '@examples' : ['select near142, resi 142 around 5'],
        name: 'select',
        map: () => B.struct.generator.atomGroups()
    }
}

export default commands
