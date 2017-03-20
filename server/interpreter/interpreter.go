package interpreter

import (
	"fmt"

	"CodeCity/server/interpreter/ast"
	"CodeCity/server/interpreter/object"
)

// Interpreter implements a JavaScript interpreter.
type Interpreter struct {
	state   state
	value   object.Value
	Verbose bool
}

// NewInterpreter takes a JavaScript program, in the form of an
// JSON-encoded ESTree, and creates a new Interpreter that will
// execute that program.
func NewInterpreter(astJSON string) *Interpreter {
	var this = new(Interpreter)

	tree, err := ast.NewFromJSON(astJSON)
	if err != nil {
		panic(err)
	}
	s := newScope(nil, this)
	// FIXME: insert global names into s
	this.state = newState(nil, s, tree)
	return this
}

// Step performs the next step in the evaluation of program.  Returns
// true if a step was executed; false if the program has terminated.
func (this *Interpreter) Step() bool {
	if this.state == nil {
		return false
	}
	if this.Verbose {
		fmt.Printf("Next step is a %T\n", this.state)
	}
	this.state = this.state.step()
	return true
}

// Run runs the program to completion.
func (this *Interpreter) Run() {
	for this.Step() {
	}
}

// Value returns the final value computed by the last statement
// expression of the program.
func (this *Interpreter) Value() object.Value {
	return this.value
}

// acceptValue receives values computed by StatementExpressions; the
// last such value accepted is the completion value of the program.
func (this *Interpreter) acceptValue(v object.Value) {
	if this.Verbose {
		fmt.Printf("Interpreter just got %v.\n", v)
	}
	this.value = v
}

/********************************************************************/

// scope implements JavaScript (block) scope; it's basically just a
// mapping of declared variable names to values, with two additions:
//
// - parent is a pointer to the parent scope (if nil then this is the
// global scope)
//
// - interpreter is a pointer to the interpreter that this scope
// belongs to.  It is provided so that stateExpressionStatement can
// send a completion value to the interpreter, which is useful for
// testing purposes now and possibly for eval() later.  This may go
// away if we find a better way to test and decide not to implement
// eval().  It's on scope instead of stateCommon just to reduce the
// number of redundant copies.
//
// FIXME: readonly flag?  Or readonly if parent == nil?
type scope struct {
	names       map[string]object.Value
	parent      *scope
	interpreter *Interpreter
}

// newScope is a factory for scope objects.  The parent param is a
// pointer to the parent (enclosing scope); it is nil if the scope
// being created is the global scope.  The interpreter param is a
// pointer to the interpreter this scope belongs to.
func newScope(parent *scope, interpreter *Interpreter) *scope {
	return &scope{make(map[string]object.Value), parent, interpreter}
}

/********************************************************************/

// state is the interface implemented by each of the types
// representing different possible next states for the interpreter
// (roughly: one state per ast.Node implementation); each value of
// this type represents a possible state of the computation.
type state interface {
	// step performs the next step in the evaluation of the program, and
	// returns the new state execution state.
	step() state
}

// valueAcceptor is the interface implemented by any object (mostly
// states with subexpressions) that can accept a value.
type valueAcceptor interface {
	// acceptValue receives the value resulting from the evaluation of
	//a child expression.
	/// It is normally called by the
	// subexpression's step method, typically as follows:
	//
	//        // ... compute value to be returned ...
	//        this.parent.acceptValue(value)
	//        return this.parent
	//    }
	acceptValue(object.Value)
}

// newState creates a state object corresponding to the given AST
// node.  The parent parameter represents the state the interpreter
// should return to after evaluating the tree rooted at node.
func newState(parent state, scope *scope, node ast.Node) state {
	var sc = stateCommon{parent, scope}
	switch n := node.(type) {
	case *ast.BinaryExpression:
		s := stateBinaryExpression{stateCommon: sc}
		s.init(n)
		return &s
	case *ast.BlockStatement:
		s := stateBlockStatement{stateCommon: sc}
		s.init(n)
		return &s
	case *ast.ConditionalExpression:
		s := stateConditionalExpression{stateCommon: sc}
		s.init(n)
		return &s
	case *ast.EmptyStatement:
		s := stateEmptyStatement{stateCommon: sc}
		s.init(n)
		return &s
	case *ast.ExpressionStatement:
		s := stateExpressionStatement{stateCommon: sc}
		s.init(n)
		return &s
	case *ast.FunctionDeclaration:
		s := stateFunctionDeclaration{stateCommon: sc}
		s.init(n)
		return &s
	case *ast.Literal:
		s := stateLiteral{stateCommon: sc}
		s.init(n)
		return &s
	case *ast.Program:
		s := stateBlockStatement{stateCommon: sc}
		s.initFromProgram(n)
		return &s
	default:
		panic(fmt.Errorf("State for AST node type %T not implemented\n", n))
	}
}

/********************************************************************/

// stateCommon is a struct, intended to be embedded in most or all
// state<NodeType> types, which provides fields common to most/all
// states.
type stateCommon struct {
	// state is the state to return to once evaluation of this state
	// is finished.  (This is "state" rather than "*state" because the
	// interface value already containins a pointer to the actual
	// state<Whatever> object.)
	parent state

	//
	scope *scope
}

/********************************************************************/

type stateBinaryExpression struct {
	stateCommon
	op                  string
	lNode, rNode        ast.Expression
	haveLeft, haveRight bool
	left, right         object.Value
}

func (this *stateBinaryExpression) init(node *ast.BinaryExpression) {
	this.op = node.Operator
	this.lNode = node.Left
	this.rNode = node.Right
	this.haveLeft = false
	this.haveRight = false
}

func (this *stateBinaryExpression) step() state {
	if !this.haveLeft {
		return newState(this, this.scope, ast.Node(this.lNode.E))
	} else if !this.haveRight {
		return newState(this, this.scope, ast.Node(this.rNode.E))
	}

	// FIXME: implement other operators, types

	var v object.Value
	switch this.op {
	case "+":
		v = object.Number(this.left.(object.Number) +
			this.right.(object.Number))
	case "-":
		v = object.Number(this.left.(object.Number) -
			this.right.(object.Number))
	case "*":
		v = object.Number(this.left.(object.Number) *
			this.right.(object.Number))
	case "/":
		v = object.Number(this.left.(object.Number) /
			this.right.(object.Number))
	default:
		panic("not implemented")
	}

	this.parent.(valueAcceptor).acceptValue(v)
	return this.parent

}

func (this *stateBinaryExpression) acceptValue(v object.Value) {
	if this.scope.interpreter.Verbose {
		fmt.Printf("stateBinaryExpression just got %v.\n", v)
	}
	if !this.haveLeft {
		this.left = v
		this.haveLeft = true
	} else if !this.haveRight {
		this.right = v
		this.haveRight = true
	} else {
		panic(fmt.Errorf("too may values"))
	}
}

/********************************************************************/

type stateBlockStatement struct {
	stateCommon
	body  ast.Statements
	value object.Value
	n     int
}

func (this *stateBlockStatement) initFromProgram(node *ast.Program) {
	this.body = node.Body
}

func (this *stateBlockStatement) init(node *ast.BlockStatement) {
	this.body = node.Body
}

func (this *stateBlockStatement) step() state {
	if this.n < len(this.body) {
		s := newState(this, this.scope, (this.body)[this.n])
		this.n++
		return s
	}
	return this.parent
}

/********************************************************************/

type stateConditionalExpression struct {
	stateCommon
	test       ast.Expression
	consequent ast.Expression
	alternate  ast.Expression
	result     bool
	haveResult bool
}

func (this *stateConditionalExpression) init(node *ast.ConditionalExpression) {
	this.test = node.Test
	this.consequent = node.Consequent
	this.alternate = node.Alternate
}

func (this *stateConditionalExpression) step() state {
	if !this.haveResult {
		return newState(this, this.scope, ast.Node(this.test.E))
	}
	if this.result {
		return newState(this.parent, this.scope, this.consequent.E)
	} else {
		return newState(this.parent, this.scope, this.alternate.E)
	}
}

func (this *stateConditionalExpression) acceptValue(v object.Value) {
	if this.scope.interpreter.Verbose {
		fmt.Printf("stateConditionalExpression just got %v.\n", v)
	}
	this.result = object.IsTruthy(v)
	this.haveResult = true
}

/********************************************************************/

type stateEmptyStatement struct {
	stateCommon
}

func (this *stateEmptyStatement) init(node *ast.EmptyStatement) {
}

func (this *stateEmptyStatement) step() state {
	return this.parent
}

/********************************************************************/

type stateExpressionStatement struct {
	stateCommon
	expr ast.Expression
	done bool
}

func (this *stateExpressionStatement) init(node *ast.ExpressionStatement) {
	this.expr = node.Expression
	this.done = false
}

func (this *stateExpressionStatement) step() state {
	if !this.done {
		return newState(this, this.scope, ast.Node(this.expr.E))
	} else {
		return this.parent
	}
}

func (this *stateExpressionStatement) acceptValue(v object.Value) {
	if this.scope.interpreter.Verbose {
		fmt.Printf("stateExpressionStatement just got %v.\n", v)
	}
	this.scope.interpreter.acceptValue(v)
	this.done = true
}

/********************************************************************/

type stateFunctionDeclaration struct {
	stateCommon
}

func (this *stateFunctionDeclaration) init(node *ast.FunctionDeclaration) {
}

func (this *stateFunctionDeclaration) step() state {
	return this.parent
}

/********************************************************************/

type stateLiteral struct {
	stateCommon
	value object.Value
}

func (this *stateLiteral) init(node *ast.Literal) {
	this.value = object.PrimitiveFromRaw(node.Raw)
}

func (this *stateLiteral) step() state {
	this.parent.(valueAcceptor).acceptValue(this.value)
	return this.parent
}
