import { type BaseEditor, Element as SlateElement } from "slate";
import { SyntaxPlugin, type BasicProps } from "./base-plugin";

export const DEFAULT_IMAGE_NAME = 'image' as const
export class ImageSyntax<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_IMAGE_NAME,
            isBlock: true,
            isVoid: true,
            triggerKeyword: ')',
            syntaxMatcher: /^\!\[.*\]\(.*\)$/
        })
    }

    onDeleteReplace(): Partial<SlateElement> | null {
        return null
    }

    onCreateReplace(matched: string): Partial<SlateElement> {
        const result = /^\!\[(.*)\]\((.*)\)$/.exec(matched)
        const alt = result?.[1]
        const url = result?.[2]
        return {
            // @ts-ignore
            type: this.name,
            isInitial: !url,
            link: url,
            alt,
        }
    }
}
