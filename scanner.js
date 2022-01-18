import {
    COLON,
    COMMA,
    LEFT_BRACE,
    LEFT_SQUARE_BRACE,
    NUMBER,
    RIGHT_BRACE,
    RIGHT_SQUARE_BRACE,
    STRING,
    NULL,
    TRUE,
    FALSE, EOF,
} from "./tokenType.js";

import {Token} from "./token.js";

export class Scanner {
    source
    tokens = []
    start = 0;
    current = 0;
    keywords = new Map()
        .set("null", NULL)
        .set("true", TRUE)
        .set("false", FALSE)

    constructor(src_json) {
        this.source = src_json
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken()
        }
        this.tokens.push(new Token(EOF, '', null))
        return this.tokens
    }

    scanToken() {
        const c = this.advance();
        switch (c) {
            case '{':
                this.addToken(LEFT_BRACE);
                break;
            case '}':
                this.addToken(RIGHT_BRACE);
                break;
            case '[':
                this.addToken(LEFT_SQUARE_BRACE)
                break
            case ']':
                this.addToken(RIGHT_SQUARE_BRACE)
                break;
            case ',':
                this.addToken(COMMA);
                break
            case ':':
                this.addToken(COLON)
                break
            case ' ':
            case "\n":
            case "\t":
                break
            case '"':
                this.string()
                break
            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier()
                } else {
                    console.log("error", c)
                    throw Error("Unexpected character.");
                }
        }
    }

    identifier() {
        while (this.isAlpha(this.peek())) this.advance();
        const text = this.source.slice(this.start, this.current)
        const kwd = this.keywords.get(text)
        if (kwd) {
            this.addToken(kwd, text)
        } else {
            throw Error(`unknown keyword ${text}`)
        }
    }

    addToken(type, literal) {
        const text = this.source.slice(this.start, this.current)
        this.tokens.push(new Token(type, text, literal))
    }

    advance() {
        this.current++
        return this.source.at(this.current - 1)
    }

    isAtEnd() {
        return this.current >= this.source.length;
    }

    string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            this.advance();
        }
        if (this.isAtEnd()) {
            throw Error("Unterminated string.")
        }
        // the closing '"'
        this.advance();
        const value = this.source.slice(this.start + 1, this.current - 1)
        this.addToken(STRING, value)
    }

    peek() {
        if (this.isAtEnd()) return '\0';
        return this.source.at(this.current)
    }

    isDigit(c) {
        return (c >= '0' && c <= '9') || c === '-'
    }

    number() {
        const negativeFlag = this.source.at(this.current - 1) === '-';
        if (negativeFlag) {
            this.start++
        }
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        // look for a fractional part
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            // consume "."
            this.advance()
            while (this.isDigit(this.peek())) this.advance()
        }
        let literal = Number.parseFloat(this.source.slice(this.start, this.current));
        if (negativeFlag) {
            literal = -1 * literal
        }
        this.addToken(NUMBER, literal)
    }

    peekNext() {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source.at(this.current + 1)
    }

    isAlpha(c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
    }

}
