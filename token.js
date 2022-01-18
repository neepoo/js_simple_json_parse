export class Token {
    type
    lexeme
    literal

    constructor(type, lexeme, literal) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
    }
}