import { type BaseEditor } from "slate";
import { SyntaxPlugin, type BasicProps } from "./base-plugin";

const DEFAULT_HEADING_ONE_NAME = 'heading_one' as const
export class HeadingOne<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_HEADING_ONE_NAME,
            triggerKeyword: ' ',
            syntaxMatcher: [/^# $/],
            isBlock: true
        })
    }
}
export const DEFAULT_HEADING_TWO_NAME = 'heading_two' as const
export class HeadingTwo<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_HEADING_TWO_NAME,
            triggerKeyword: ' ',
            syntaxMatcher: [/^## $/],
            isBlock: true
        })
    }
}

export const DEFAULT_HEADING_THREE_NAME = 'heading_three' as const
export class HeadingThree<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_HEADING_THREE_NAME,
            triggerKeyword: ' ',
            syntaxMatcher: [/^### $/],
            isBlock: true
        })
    }
}

export const DEFAULT_HEADING_FOUR_NAME = 'heading_four' as const
export class HeadingFour<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_HEADING_FOUR_NAME,
            triggerKeyword: ' ',
            syntaxMatcher: [/^#### $/],
            isBlock: true
        })
    }
}

export const DEFAULT_HEADING_FIVE_NAME = 'heading_five' as const
export class HeadingFive<T extends BaseEditor> extends SyntaxPlugin<T> {
    isBlock = true
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_HEADING_FIVE_NAME,
            triggerKeyword: ' ',
            syntaxMatcher: [/^##### $/],
            isBlock: true
        })
    }
}

export const DEFAULT_HEADING_SIX_NAME = 'heading_six' as const
export class HeadingSix<T extends BaseEditor> extends SyntaxPlugin<T> {
    isBlock = true
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_HEADING_SIX_NAME,
            triggerKeyword: ' ',
            syntaxMatcher: [/^###### $/],
            isBlock: true
        })
    }
}
