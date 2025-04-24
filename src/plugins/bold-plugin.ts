import { type BaseEditor } from "slate";
import { SyntaxPlugin, type BasicProps } from "./base-plugin";

export const DEFAULT_BOLD_NAME = 'bold' as const
export class BoldSyntax<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_BOLD_NAME,
            isLeaf: true,
            triggerKeyword: ['_', '*'],
            syntaxMatcher: [/\*\*([^*]+)\*\*$/, /__([^_]+)__$/]
        })
    }
}
