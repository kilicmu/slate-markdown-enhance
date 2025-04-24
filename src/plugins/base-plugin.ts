import { type BaseEditor, Element as SlateElement } from "slate";

export interface BasicProps {
    name?: string
}

export interface BasicFatherProps<T extends BaseEditor> {
    name?: string
    children: SyntaxPlugin<T>[]
}

export interface SyntaxPluginProps<T extends BaseEditor> extends Required<BasicProps> {
    isVoid?: boolean;
    isInline?: boolean,
    isLeaf?: boolean,
    isBlock?: boolean,
    triggerKeyword?: string | string[]
    syntaxMatcher: RegExp | RegExp[]
    children?: SyntaxPlugin<T>[],
    isControlledBreak?: boolean
}

export abstract class SyntaxPlugin<T extends BaseEditor> {
    protected _editor: T | null = null;
    name: string
    isVoid: boolean = false
    isInline: boolean = false
    isLeaf: boolean = false
    isBlock: boolean = false
    triggerKeyword: string[]
    syntaxMatcher: RegExp[]
    children: SyntaxPlugin<T>[] = []
    isControlledBreak: boolean = false

    constructor(opt: SyntaxPluginProps<T>) {
        this.name = opt.name
        this.isVoid = opt.isVoid ?? false
        this.isInline = opt.isInline ?? false
        this.isLeaf = opt.isLeaf ?? false
        this.isBlock = opt.isBlock ?? false
        opt.triggerKeyword = opt.triggerKeyword ?? []
        this.triggerKeyword = Array.isArray(opt.triggerKeyword) ? opt.triggerKeyword : [opt.triggerKeyword]
        this.syntaxMatcher = Array.isArray(opt.syntaxMatcher) ? opt.syntaxMatcher : [opt.syntaxMatcher]
        this.children = opt.children ?? []
        this.isControlledBreak = opt.isControlledBreak ?? false
    }

    injectEditor(editor: T) {
        this._editor = editor
    }

    onDeleteReplace(): Partial<SlateElement> | null {
        return {
            type: 'paragraph',
            children: [
                { text: '' }
            ]
        } as Partial<SlateElement>
    }

    onCreateReplace(matched: string) {
        return {
            type: this.name,
            children: [{ text: '' }]
        } as Partial<SlateElement>
    }

    shouldBreak(text: string) {
        if (!this.isControlledBreak)
            throw new Error("should implement this method if syntax is controlled break")
        return true
    }

    findTriggedMatcher(typedText: string, fullText: string) {
        if(!this.syntaxMatcher || !this.triggerKeyword) {
            return false
        } 
        if(!this.triggerKeyword.some((word) => typedText.endsWith(word))) {
            return false
        }

        return this.syntaxMatcher.find((matcher) => matcher.test(fullText))
    }
}
