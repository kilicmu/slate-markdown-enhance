import { type BaseEditor } from "slate";
import { SyntaxPlugin, type BasicProps } from "./base-plugin";

export const DEFAULT_ITALIC_SYNTAX = 'italic'
export class ItalicSyntax<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_ITALIC_SYNTAX,
            isLeaf: true,
            triggerKeyword: ['_', '*'],
            syntaxMatcher: [
                /(?<!\*)\*([^*]+)\*(?!\*)$/,
                /(?<!_)_([^_]+)_(?!_)$/
            ]
        })
    }
}
