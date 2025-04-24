import { Transforms, Editor, Range, Text, Point, Element as SlateElement, Path, BaseEditor } from "slate"
import { SyntaxPlugin } from "./plugins/base-plugin";
import { ItalicSyntax } from "./plugins/italic-plugin";
import { BoldSyntax } from "./plugins/bold-plugin";
import { CodeSyntax } from "./plugins/code-plugin";
import { HeadingOne, HeadingTwo, HeadingThree, HeadingFour, HeadingFive, HeadingSix } from "./plugins/heading-plugin";
import { ListSyntax, ListSyntaxContainer } from "./plugins/list-plugin";
import { OlListSyntax, OlListSyntaxContainer } from "./plugins/ol-list-plugin";
import { ImageSyntax } from "./plugins/image-plugin";
import { CodeblockSyntax } from "./plugins/codeblock-plugin";
import { BlockQuoteSyntax } from "./plugins/blockquote-plugin";

// Export all plugin classes
export * from "./plugins/base-plugin";
export * from "./plugins/italic-plugin";
export * from "./plugins/bold-plugin";
export * from "./plugins/code-plugin";
export * from "./plugins/heading-plugin";
export * from "./plugins/list-plugin";
export * from "./plugins/ol-list-plugin";
export * from "./plugins/image-plugin";
export * from "./plugins/codeblock-plugin";
export * from "./plugins/blockquote-plugin";

export const withMarkdownSupport = <T extends BaseEditor>(_plugins: SyntaxPlugin<T>[] = [
    new HeadingOne(),
    new HeadingTwo(),
    new HeadingThree(),
    new HeadingFour(),
    new HeadingFive(),
    new HeadingSix(),
    new BoldSyntax(),
    new ItalicSyntax(),
    new CodeSyntax(),
    new ListSyntaxContainer({
        children: [new ListSyntax()]
    }),
    new OlListSyntaxContainer({
        children: [new OlListSyntax()]
    }),
    new ImageSyntax(),
    new CodeblockSyntax(),
    new BlockQuoteSyntax()
]) => (editor: T) => {
    const { deleteBackward, insertText } = editor
    
    const children2parent: Record<string, any> = {}
    const plugins = _plugins.flatMap(i => {
        if (i.children.length) {
            i.children.map(child => { children2parent[child.name] = i.name })
            return [i, ...i.children]
        }
        return i
    }).map(p => {
        p.injectEditor(editor)
        return p
    })

    function checkConvertLeafSyntax(text: string): boolean {
        const leafPlugins = plugins.filter(i => i.isLeaf)
        if (!leafPlugins.length) {
            return false
        }

        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {
            const { anchor } = selection
            const { path, offset: selectionOffset } = anchor
            const block = Editor.above(editor, {
                match: n => {
                    return SlateElement.isElement(n) && Editor.isBlock(editor, n)
                },
            })

            if (!block) {
                return false
            }
            const [, blockPath] = block
            const start = Editor.start(editor, blockPath)
            const range = { anchor, focus: start }

            for (const plugin of leafPlugins) {
                const fullText = Editor.string(editor, range) + text
                const matchedReg = plugin.findTriggedMatcher(text, fullText)
                if (!matchedReg) {
                    continue
                }
                const [matchFullText, matchText] = matchedReg.exec(fullText)!
                const startOffset = selectionOffset - matchFullText.length + 1

                Transforms.delete(editor, {
                    at: {
                        anchor: { path, offset: startOffset },
                        focus: { path, offset: selectionOffset }
                    }
                })

                Transforms.insertText(editor, matchText, {
                    at: { path, offset: startOffset }
                })

                Transforms.select(editor, {
                    anchor: { path, offset: startOffset },
                    focus: { path, offset: startOffset + matchText.length }
                })

                Transforms.setNodes(
                    editor,
                    { [plugin.name]: true },
                    { match: (n) => Text.isText(n), split: true }
                )

                Transforms.select(editor, Editor.end(editor, path))
                return true
            }
        }

        return false
    }

    function checkConvertBlockSyntax(text: string): boolean {
        const blockPlugins = plugins.filter(p => p.isBlock)
        const selection = editor.selection
        if (!selection || !Range.isCollapsed(selection)) {
            return false
        }
        const { anchor } = selection
        const block = Editor.above(editor, {
            match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
        })
        const path = block ? block[1] : []
        const start = Editor.start(editor, path)
        const range = { anchor, focus: start }
        const beforeText = Editor.string(editor, range) + text
        for (const plugin of blockPlugins) {
            const matchedRegexp = plugin.findTriggedMatcher(text, beforeText)
            if (!matchedRegexp) {
                continue
            }
            const name = plugin.name
            Transforms.select(editor, range)

            if (!Range.isCollapsed(range)) {
                Transforms.delete(editor)
            }
            
            const execresult = matchedRegexp.exec(beforeText) ?? []
            const newProperties = plugin.onCreateReplace(execresult[0]!)

            Transforms.setNodes<SlateElement>(editor, newProperties, {
                match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
                at: path
            })

            if (Object.keys(children2parent).includes(name)) {
                // align with the markdown structure
                const parenttype = children2parent[name]
                const wrapper = {
                    type: parenttype,
                    children: [],
                }
                Transforms.wrapNodes(editor, wrapper, {
                    match: n =>
                        !Editor.isEditor(n) &&
                        SlateElement.isElement(n) &&
                        n.type === name,
                })
            }
            return true
        }
        return false
    }

    editor.insertText = text => {
        editor.withoutNormalizing(() => {
            if (checkConvertLeafSyntax(text)) {
                return
            }
            if (checkConvertBlockSyntax(text)) {
                return
            }
            insertText(text)
        })
    }

    const { isInline } = editor
    editor.isInline = element => {
        return plugins.filter(p => p.isInline).map(i => i.name).includes(element.type) || isInline(element)
    }
    const { isVoid } = editor
    editor.isVoid = element => {
        return plugins.filter(p => p.isVoid).map(i => i.name).includes(element.type) || isVoid(element)
    };

    editor.deleteBackward = (...args) => {
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above(editor, {
                match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
            })

            if (match) {
                const [block, path] = match
                const start = Editor.start(editor, path)

                if (
                    !Editor.isEditor(block) &&
                    SlateElement.isElement(block) &&
                    block.type !== 'paragraph' &&
                    Point.equals(selection.anchor, start)
                ) {
                    const plugin = plugins.find(i => i.name === block.type)
                    const properties = plugin?.onDeleteReplace()

                    if (!properties) {
                        Transforms.removeNodes(editor, { at: path })
                        return
                    }
                    
                    Transforms.setNodes(editor, properties)

                    if (Object.keys(children2parent).includes(block.type)) {
                        Transforms.unwrapNodes(editor, {
                            match: n =>
                                !Editor.isEditor(n) &&
                                SlateElement.isElement(n) &&
                                children2parent[block.type].includes(n.type),
                            split: true,
                        })
                    }
                    return
                }
            }
            deleteBackward(...args)
        }

    }

    const { insertBreak } = editor
    editor.insertBreak = () => {
        const selection = editor.selection
        editor.withoutNormalizing(() => {
            if (selection && Range.isCollapsed(selection)) {
                const [node] = Editor.node(editor, selection)
                // for nested block. if finally children block typed noting. finish this block.
                const childitem = Editor.above(editor, {
                    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && Object.keys(children2parent).includes(n.type)
                })
                if (childitem && Text.isText(node)) {
                    if (!node.text.trim()) {
                        Transforms.setNodes(editor, { type: 'paragraph', children: [{ text: '' }] }, {
                            at: childitem[1]
                        })

                        const parententry = Editor.above(editor, {
                            match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && Object.values(children2parent).includes(n.type)
                        })
                        if (parententry) {
                            Transforms.moveNodes(editor, { to: Path.next(parententry[1]) })
                        }
                        return
                    }
                }
            }


            const controlledBreakPlugins = plugins.filter(i => i.isControlledBreak)
            const controlledBreakTypes = controlledBreakPlugins.map(t => t.name)
            if(!controlledBreakPlugins.length){
                return
            }
            // some block should auto break when its new line is empty
            let type = ''
            const controlledBreakBlockEntry = Editor.above(editor, {
                match: (n) => {
                    const ret = !Editor.isEditor(n) && SlateElement.isElement(n) && controlledBreakTypes.includes(n.type)
                    if(ret)
                        type = n.type
                    return ret
                }
            })
            if (!controlledBreakBlockEntry) {
                insertBreak()
            } else {
                const controlledBreakPlugin = controlledBreakPlugins.find(i => i.name === type)
                const selection = editor.selection
                if (selection && Range.isCollapsed(selection)) {
                    const [_, pos] = controlledBreakBlockEntry
                    const blockcontentLeaf = Editor.last(editor, pos)
                    if (blockcontentLeaf) {
                        const [codeLeaf] = blockcontentLeaf
                        if (Text.isText(codeLeaf)) {
                            const text = codeLeaf.text
                            if(controlledBreakPlugin?.shouldBreak(text)) {
                                Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] }, { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === type })
                            } else {
                                    Transforms.insertText(editor, '\n', {
                                    at: selection
                                })
                            }
                        }
                    }
                }
                return
            }
            const shouldtBreakElm = Object.entries(children2parent).flat(1)
            const newSelection = editor.selection
            if (newSelection && Range.isCollapsed(newSelection)) {
                const hasParent = Editor.above(editor, {
                    at: newSelection,
                    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && shouldtBreakElm.includes(n.type)
                })
                if (!hasParent)
                    Transforms.setNodes(editor, { type: 'paragraph', children: [{ text: '' }] }, { at: newSelection })
            }
        })
    }

    return editor
}
