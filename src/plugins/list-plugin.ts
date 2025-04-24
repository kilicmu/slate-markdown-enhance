import { type BaseEditor } from "slate";
import { SyntaxPlugin, type BasicProps, type BasicFatherProps } from "./base-plugin";

export const DEFAULT_LIST_ITEM_NAME = "list_item"
export class ListSyntax<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicProps = {}) {
        super({
            name: opt.name ?? DEFAULT_LIST_ITEM_NAME,
            isBlock: true, triggerKeyword: ' ',
            syntaxMatcher: [/^\+ $/, /^\- $/, /^\* $/]
        })
    }
}

export const DEFAULT_LIST_CONTAINER_NAME = "ul_list"
export class ListSyntaxContainer<T extends BaseEditor> extends SyntaxPlugin<T> {
    constructor(opt: BasicFatherProps<T> = {children: []}) {
        super({
            name: opt.name ?? DEFAULT_LIST_CONTAINER_NAME,
            children: opt.children ?? [],
            isBlock: false,
            syntaxMatcher: []
        })
    }
}
