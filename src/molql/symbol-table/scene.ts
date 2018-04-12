// declare new symbols needed for the commands here

import Type from '../type'
import { Arguments, Argument } from '../symbol'
import { symbol } from '../helpers'
import { Types } from './structure'

const command = {
    '@header': 'commands',
    select: symbol(Arguments.Dictionary({
        'property-selector' : Argument(Type.Any, { isOptional: true, defaultValue: "name", description: 'Property used for selection of atom-groups.' }),
        'entity-test': Argument(Type.Bool, { isOptional: true, defaultValue: true, description: 'Test for the 1st atom of every entity' }),
        'chain-test': Argument(Type.Bool, { isOptional: true, defaultValue: true, description: 'Test for the 1st atom of every chain'  }),
        'residue-test': Argument(Type.Bool, { isOptional: true, defaultValue: true, description: 'Test for the 1st atom every residue'  }),
        'atom-test': Argument(Type.Bool, { isOptional: true, defaultValue: true }),
        'group-by': Argument(Type.Any, { isOptional: true, defaultValue: `atom-key`, description: 'Group atoms to sets based on this property. Default: each atom has its own set' }),
    }), Types.AtomSelectionQuery, 'Symbol for PyMol select command. Uses AtomGroups function for now.')
}

export default {
    '@header': 'Scene Queries',
    command
}
