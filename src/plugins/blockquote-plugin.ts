import { type BaseEditor, type Element as SlateElement } from "slate";
import { SyntaxPlugin, type BasicProps } from "./base-plugin";

export const DEFAULT_BLOCK_QUOTE_NAME = 'block_quote' as const
export class BlockQuoteSyntax<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_BLOCK_QUOTE_NAME,
            isBlock: true,
            triggerKeyword: ' ',
            syntaxMatcher: /^> $/,
            isControlledBreak: true
        })
    }

    onCreateReplace(): Partial<SlateElement> {
        return {
            type: this.name,
            children: [
                { text: '' }
            ]
        }
    }

    shouldBreak(text: string): boolean {
        const lines = text.split(/\n/);
        if (lines.length >= 2 && !lines[lines.length - 1] && this._editor?.selection?.focus.offset === text.length) {
            return true
        }
        return false
    }
}
