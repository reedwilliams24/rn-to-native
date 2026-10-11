let maxTodos = 100 // no const keyword // @link:maxconst

let name = "Reed" // constant, like const // @link:const
var count = 0 // mutable, like let // @link:var
count += 1 // @link:inc

// Needs var: arrays are values
var todos: [String] = [] // @link:list
todos.append("Buy milk") // @link:add

let total: Int = 42 // type after the name // @link:total
let ratio = total / 5 // 8: integer division // @link:ratio
let exact = Double(total) / 5 // 8.4: convert first // @link:exact
