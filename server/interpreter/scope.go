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
	"fmt"

	"CodeCity/server/interpreter/ast"
	"CodeCity/server/interpreter/data"
)

// scope is a symbol table used to implement JavaScript scope; it's
// basically just a mapping of declared variable names to values, with
// an addiontal property:
//
// - parent is a pointer to the parent scope (if nil then this is the
// global scope)
//
// - this is the current binding of the "this" special variable in
// this scope.
//
// FIXME: readonly flag?  Or readonly if parent == nil?
type scope struct {
	vars   map[string]data.Value
	parent *scope
	this   data.Value
}

// newScope is a factory for scope objects.  The parent param is a
// pointer to the parent (enclosing scope).  The this param is the
// value of ThisExpression in the given scope.  Both should be nil if
// the scope being created is the global scope.
func newScope(parent *scope, this data.Value) *scope {
	return &scope{make(map[string]data.Value), parent, this}
}

// newVar creates a new variabe in the scope, setting it to the given
// value (or, if the named variable already exists, updates its
// value).
func (sc *scope) newVar(name string, value data.Value) {
	sc.vars[name] = value
}

// setVar sets the named variable to the specified value, after
// first checking that it exists.
//
// FIXME: this should probably not recurse when called from
// stateVariableDeclarator, which should never be setting variables
// other than in the immediately-enclosing scope.
func (sc *scope) setVar(name string, value data.Value) {
	_, ok := sc.vars[name]
	if ok {
		sc.vars[name] = value
		return
	}
	if sc.parent != nil {
		sc.parent.setVar(name, value)
		return
	}
	panic(fmt.Errorf("can't set undeclared variable %v", name))
}

// getVar gets the current value of the specified variable, after
// first checking that it exists.
func (sc *scope) getVar(name string) data.Value {
	v, ok := sc.vars[name]
	if ok {
		return v
	}
	if sc.parent != nil {
		return sc.parent.getVar(name)
	}
	// FIXME: should probably throw
	panic(fmt.Errorf("can't get undeclared variable %v", name))
}

// getRef returns a reference to the specified variable; this will be
// an uresolvable reference if the variable does not exist.
func (sc *scope) getRef(name string) reference {
	_, ok := sc.vars[name]
	if ok {
		return newReference(sc, name)
	} else if sc.parent == nil {
		return newReference(nil, name)
	}
	return sc.parent.getRef(name)
}

// populate takes a syntax (sub)tree; the tree is searched for
// declarations in it's outermost scope (i.e., ignoring function
// declarations) and updates the scope object with any variables
// found.  This is how function and variable hoisting is performed.
func (sc *scope) populate(node ast.Node, intrp *Interpreter) {
	switch n := node.(type) {

	// The interesting cases:
	case *ast.VariableDeclarator:
		sc.newVar(n.Id.Name, data.Undefined{})
	case *ast.FunctionDeclaration:
		// Add name of function to scope and initialise it with a
		// closure.  Ignore contained subtree (it will be examined
		// when the function is called).
		//
		// FIXME: set owner:
		cl := newClosure(nil, intrp.protos.FunctionProto, sc, n.Params, n.Body)
		sc.newVar(n.Id.Name, cl)

	// The recursive cases:
	case *ast.BlockStatement:
		for _, s := range n.Body {
			sc.populate(s, intrp)
		}
	case *ast.CatchClause:
		sc.populate(n.Body, intrp)
	case *ast.DoWhileStatement:
		sc.populate(n.Body.S, intrp)
	case *ast.ForInStatement:
		sc.populate(n.Left.N, intrp)
		sc.populate(n.Body.S, intrp)
	case *ast.ForStatement:
		if n.Init.N != nil {
			sc.populate(n.Init.N, intrp)
		}
		if n.Body.S != nil {
			sc.populate(n.Body.S, intrp)
		}
	case *ast.IfStatement:
		sc.populate(n.Consequent.S, intrp)
		if n.Alternate.S != nil {
			sc.populate(n.Alternate.S, intrp)
		}
	case *ast.LabeledStatement:
		sc.populate(n.Body.S, intrp)
	case *ast.Program:
		for _, s := range n.Body {
			sc.populate(s, intrp)
		}
	case *ast.SwitchCase:
		for _, s := range n.Consequent {
			sc.populate(s, intrp)
		}
	case *ast.SwitchStatement:
		for _, c := range n.Cases {
			sc.populate(c, intrp)
		}
	case *ast.TryStatement:
		sc.populate(n.Block, intrp)
		if n.Handler != nil {
			sc.populate(n.Handler, intrp)
		}
		if n.Finalizer != nil {
			sc.populate(n.Finalizer, intrp)
		}
	case *ast.VariableDeclaration:
		for _, d := range n.Declarations {
			sc.populate(d, intrp)
		}
	case *ast.WhileStatement:
		sc.populate(n.Body.S, intrp)
	case *ast.WithStatement:
		panic("not implemented")

	// The cases we can ignore because they cannot contain
	// declarations:
	case *ast.ArrayExpression:
	case *ast.AssignmentExpression:
	case *ast.BinaryExpression:
	case *ast.BreakStatement:
	case *ast.CallExpression:
	case *ast.ConditionalExpression:
	case *ast.ContinueStatement:
	case *ast.DebuggerStatement:
	case *ast.EmptyStatement:
	case *ast.ExpressionStatement:
	case *ast.FunctionExpression:
	case *ast.Identifier:
	case *ast.Literal:
	case *ast.LogicalExpression:
	case *ast.MemberExpression:
	case *ast.NewExpression:
	case *ast.ObjectExpression:
	case *ast.Property:
	case *ast.ReturnStatement:
	case *ast.SequenceExpression:
	case *ast.ThisExpression:
	case *ast.ThrowStatement:
	case *ast.UnaryExpression:
	case *ast.UpdateExpression:

	// Just in case:
	default:
		panic(fmt.Errorf("Unrecognized ast.Node type %T", node))
	}
}

// Type is defined to allow *scope to satisfy the refbase interface
// and thus be stored in the base slot of a reference.
func (scope) Type() data.Type {
	return SCOPE
}
