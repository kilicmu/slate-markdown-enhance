import { type BaseEditor } from "slate";
import { SyntaxPlugin, type BasicProps, type BasicFatherProps } from "./base-plugin";

export const DEFAULT_OL_LIST_ITEM_NAME = "ol_list_item"
export class OlListSyntax<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({ name: opt.name ?? DEFAULT_OL_LIST_ITEM_NAME, isBlock: true, triggerKeyword: ' ', syntaxMatcher: [/^1. $/] })
    }
}

export const DEFAULT_OL_LIST_CONTAINER_NAME = "ol_list"
export class OlListSyntaxContainer<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicFatherProps<T> = {children: []}) {
        super({ name: opt.name ?? DEFAULT_OL_LIST_CONTAINER_NAME, isBlock: true, syntaxMatcher: [], children: opt.children ?? [] })
    }
}
