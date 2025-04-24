import { Descendant, BaseEditor, BaseRange, Range, Element, Path } from 'slate'

e

export type CustomEditor = BaseEditor

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: {type: string, children: Descendant[], [key: string]: any},
        Text: CustomText
        Range: BaseRange & {
            [key: string]: unknown
        }
    }
}