import { type BaseEditor } from "slate";
import { SyntaxPlugin, type BasicProps } from "./base-plugin";

export const DEFAULT_CODE_NAME = 'code' as const
export class CodeSyntax<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = { name: 'code' }) {
        super({
            name: opt.name ?? DEFAULT_CODE_NAME,
            isLeaf: true,
            triggerKeyword: '`',
            syntaxMatcher: [/`([^`]+)`$/]
        })
    }
}
