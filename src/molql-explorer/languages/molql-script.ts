/*
 * Copyright (c) 2017 MolQL contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import Language from './language'
import Transpilers from '../../transpilers/all'

const lang: Language = {
    name: 'MolQL Script',
    editorMode: 'molql-script',
    transpiler: Transpilers.molQLscript,
    examples: [{
        name: 'All C or N atoms in ALA residues',
        value: `(atom.sel.atom-groups
  :residue-test (=
    (atom.auth_comp_id)
    ALA)
  :atom-test (set.has
    ;; Element symbols must be "constructed" to be normalized, e.g. Fe vs FE
    (set (atom.new.el C) (atom.new.el N))
    (atom.el)))`
    }, {
        name: 'All residues within 5 ang from Fe atom',
        value: `(atom.sel.include-surroundings
  :selection (atom.sel.atom-groups
    :atom-test (=
      (atom.el)
      (atom.new.el Fe)))
  :radius 5
  :as-whole-residues true)`
    }, {
        name: 'Cluster LYS residues within 5 ang',
        value: `(atom.sel.cluster
  :selection (atom.sel.atom-groups
    :residue-test (eq
      (atom.auth_comp_id)
      LYS)
    :group-by (atom.key.res))
  :max-distance 5)`
    }, {
        name: 'Residues with max b-factor < 45',
        value: `(atom.sel.pick
  :selection (atom.sel.atom-groups
    :group-by (atom.key.res))
  :test (<
    (atom.set.reduce
      :initial (atom.B_iso_or_equiv)
      :value (max
        (atom.set.reduce.value)
        (atom.B_iso_or_equiv)))
    35))`
    }, {
      name: 'Residues connected to HEM',
      value: `(atom.sel.is-connected-to
  :selection (atom.sel.atom-groups
    :residue-test true
    :group-by (atom.key.res))
  :target (atom.sel.atom-groups
    :residue-test (= (atom.label_comp_id) HEM)
    :group-by (atom.key.res))
  :disjunct true)`
    }, {
      name: 'HEM and 2 layers of connected residues',
      value: `(atom.sel.include-connected
  :selection (atom.sel.atom-groups
    :residue-test (= (atom.label_comp_id) HEM)
    :group-by (atom.key.res))
  :layer-count 2
  :as-whole-residues true)`
    }]
}

export default lang