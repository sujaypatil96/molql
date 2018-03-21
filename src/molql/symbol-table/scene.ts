// declare new symbols needed for the commands here

import Type from '../type'
import * as Core from './core'
import { Arguments, Argument } from '../symbol'
import { symbol } from '../helpers'
import { Types } from './structure'

const command = {
    '@header' : 'Commands',
    // add 'select' command as a Symbol
    // for this we will just be using atomGroups function
    // select: symbol();
}

export default {
    '@header': 'Scene Queries',
    command
}
