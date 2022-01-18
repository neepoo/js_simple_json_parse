import {Parse} from "./parse.js"
import {Scanner} from "./scanner.js"


/*
pub enum Value {
    Null,
    Bool(bool),
    Number(Number),
    String(String),
    Array(Vec<Value>),
    Object(Map<String, Value>),
}
 */

export function parse(s) {
    const scanner = new Scanner(s)
    // tokenize
    const tokens = scanner.scanTokens()
    // parse
    const parser = new Parse(tokens)
    // res
    return parser.parse()
}
