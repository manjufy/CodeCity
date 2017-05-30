/* Copyright 2017 Google Inc.
 * https://github.com/NeilFraser/CodeCity
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package interpreter

import (
	"CodeCity/server/interpreter/data"
	"strings"
)

func (intrp *Interpreter) mkBuiltin(path string, value data.Value) {
	cmp := strings.Split(path, ".")
	if len(cmp) == 1 {
		intrp.global.newVar(cmp[0], value)
		return
	} else {
		o := intrp.global.getVar(cmp[0]).(data.Object)
		for cmp = cmp[1:]; len(cmp) > 1; cmp = cmp[1:] {
			v, err := o.Get(cmp[0])
			if err != nil {
				panic(err)
			}
			o = v.(data.Object)
		}
		o.Set(cmp[0], value)
	}
}

// initGlobalScope initializes the global scope
func (intrp *Interpreter) initBuiltins() {
	intrp.mkBuiltin("undefined", data.Undefined{})
	intrp.initBuiltinObject()
	intrp.initBuiltinArray()
	// FIXME: insert (more) global names into intrp.global
}
