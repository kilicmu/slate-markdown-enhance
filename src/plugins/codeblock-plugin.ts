import { type BaseEditor, Element as SlateElement } from "slate";
import { SyntaxPlugin, type BasicProps } from "./base-plugin";

const DEFAULT_CODEBLOCK_NAME = 'code_block' as const
export class CodeblockSyntax<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_CODEBLOCK_NAME,
            isInline: false,
            isBlock: true,
            triggerKeyword: ' ',
            syntaxMatcher: /^```(.+)?$/,
            isControlledBreak: true
        })
    }

    onCreateReplace(matched: string): Partial<SlateElement> {
        const result = /^```(.+)?$/.exec(matched)
        const language = result?.[1]
        return {
            // @ts-ignore
            type: this.name,
            language,
            children: [
                { text: '' }
            ]
        }
    }

    shouldBreak(text: string): boolean {
        const lines = text.split(/\r\n|[\n\r\u2028\u2029]/);
        if (lines.length >= 2 && !lines[lines.length - 1] && this._editor?.selection?.focus.offset === text.length) {
            // last code line is empty case
            return true
        }
        return false
    }
}
