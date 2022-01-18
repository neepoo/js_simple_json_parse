import {
    COLON,
    COMMA,
    EOF,
    FALSE,
    LEFT_BRACE,
    LEFT_SQUARE_BRACE,
    NULL,
    NUMBER,
    RIGHT_BRACE,
    RIGHT_SQUARE_BRACE,
    STRING,
    TRUE
} from "./tokenType.js";

export class Parse {
    tokens
    current = 0

    constructor(tokens) {
        this.tokens = tokens
    }


    isAtEnd() {
        return this.tokens.at(this.current).type === EOF
    }

    previous() {
        return this.tokens.at(this.current - 1)
    }

    check(type) {
        if (this.isAtEnd()) {
            return false
        }
        return this.peek().type === type
    }

    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    peek() {
        return this.tokens.at(this.current)
    }

    advance() {
        if (!this.isAtEnd()) {
            this.current++
        }
        return this.previous();
    }

    parseObj() {
        if (this.match(LEFT_BRACE)) {
            const res = {}
            while (!this.match(RIGHT_BRACE)) {
                //
                const peek = this.peek();
                if (peek.type === COMMA) {
                    // consume ",'
                    this.advance()
                } else if (peek.type === STRING) {
                    const key = this.parseKey()
                    res[key] = this.parseObj()
                } else {
                    throw Error("illegal json")
                }
            }

            this.match(COMMA)
            return res

        } else if (this.match(LEFT_SQUARE_BRACE)) {
            // list
            return this.parseList();
        } else if (this.match(STRING, NUMBER, TRUE, FALSE, NULL)) {
            // literal
            const res = this.parseLiteral();
            // consume right brace
            const peek = this.peek();
            if (peek.type === RIGHT_BRACE || peek.type === COMMA || peek.type === RIGHT_SQUARE_BRACE) {
                return res
            } else {
                throw Error(`must be '}', ']' or ',' , but get ${peek.type}`)
            }
        } else {

            throw Error("illegal json")

        }
    }

    parse() {
        let res = {}
        while (!this.isAtEnd()) {
            // consume first {
            if (this.match(LEFT_BRACE)) {
                // begin
                this.parseEntry(res);
            } else if (this.match(COMMA)) {
                this.parseEntry(res);
            } else if (this.match(RIGHT_BRACE)) {
                // consume last }

            } else if (this.peek().type === STRING) {
                const key = this.parseKey()
                res[key] = this.parseObj()
            }
        }
        return res
    }

    // 消费json的键及其后面接着的冒号
    parseKey() {
        if (this.match(STRING)) {
            const key = this.previous()
            const keyStr = key.literal
            if (this.match(COLON)) {
                return keyStr
            } else {
                throw Error("illegal json")
            }

        } else {
            throw Error("illegal json")
        }
    }

    // 解析一个json 键值对
    parseEntry(res) {
        // consume key
        const key = this.parseKey()
        res[key] = this.parseObj()
    }

    // 解析json值为字面量的value
    parseLiteral() {
        const previous = this.previous()
        switch (previous.type) {
            case STRING:
                return previous.literal
            case NUMBER:
                return previous.literal
            case TRUE:
                return true
            case FALSE:
                return false
            case NULL:
                return null
        }
    }

    // 解析值类型为list的json值
    parseList() {
        const res = []
        while (this.peek().type !== RIGHT_SQUARE_BRACE) {
            const ele = this.parseObj()
            res.push(ele)
            if (this.match(COMMA)) {
                // this.advance()
            }
        }
        // consume ]
        this.advance()
        return res
    }
}