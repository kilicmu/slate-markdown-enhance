# slate-markdown-enhance

A powerful plugin system for [Slate](https://github.com/ianstormtaylor/slate) editor that enhances it with real-time markdown syntax support.

Its Supports [penmuse](https://penmuse.app) document editor.

## Features

- **Live Markdown Conversion**: Convert markdown syntax to formatted content as you type
- **Rich Plugin System**: Easily extensible with custom plugins
- **Block Elements**: Headings, lists, blockquotes, code blocks
- **Inline Elements**: Bold, italic, code, images
- **Smart Handling**: Intelligent handling of nested elements and special cases

## Installation

```bash
npm install slate-markdown-enhance
# or
yarn add slate-markdown-enhance
# or
pnpm add slate-markdown-enhance
```

This package requires `slate` as a peer dependency.

## Basic Usage

```typescript
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withMarkdownSupport } from 'slate-markdown-enhance';

// Create a Slate editor with markdown support
const editor = withMarkdownSupport()(withReact(createEditor()));

// Now use the editor with your Slate components
```

## Supported Markdown Syntax

| Type | Syntax | Example |
|------|--------|---------|
| Heading 1 | `# ` | `# Heading 1` |
| Heading 2 | `## ` | `## Heading 2` |
| Heading 3 | `### ` | `### Heading 3` |
| Heading 4 | `#### ` | `#### Heading 4` |
| Heading 5 | `##### ` | `##### Heading 5` |
| Heading 6 | `###### ` | `###### Heading 6` |
| Bold | `**text**` or `__text__` | `**bold**` |
| Italic | `*text*` or `_text_` | `*italic*` |
| Code | `` `code` `` | `` `code` `` |
| Unordered List | `- `, `* `, or `+ ` | `- list item` |
| Ordered List | `1. ` | `1. list item` |
| Image | `!alt` | `![example](https://example.com/img.jpg)` |
| Code Block | ``` \`\`\`language ``` | ``` \`\`\`javascript ``` |
| Block Quote | `> ` | `> quote` |

## Advanced Usage

### Custom Plugins

You can provide your own set of plugins to the `withMarkdownSupport` function:

```typescript
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withMarkdownSupport, BoldSyntax, ItalicSyntax } from 'slate-markdown-enhance';

// Only enable bold and italic
const customPlugins = [
  new BoldSyntax(),
  new ItalicSyntax()
];

const editor = withMarkdownSupport(customPlugins)(withReact(createEditor()));
```

### Creating Custom Plugins

You can extend the `SyntaxPlugin` class to create your own plugins:

```typescript
import { BaseEditor } from 'slate';
import { SyntaxPlugin } from 'slate-markdown-enhance';

export class StrikethroughSyntax<T extends BaseEditor> extends SyntaxPlugin<T> {
  constructor() {
    super({
      name: 'strikethrough',
      isLeaf: true,
      triggerKeyword: '~',
      syntaxMatcher: [/~~([^~]+)~~$/]
    });
  }
}

// Then use it
const customPlugins = [
  // ...other plugins
  new StrikethroughSyntax()
];
const editor = withMarkdownSupport(customPlugins)(withReact(createEditor()));
```

## Plugin Types

The library provides two main types of plugins:

1. **Leaf Plugins**: For inline formatting like bold, italic, code
2. **Block Plugins**: For block elements like headings, lists, code blocks

Each plugin type has different behavior and configuration options.

## Handling Special Cases

The library handles special cases like:

- Nested lists
- Controlled line breaks in code blocks and blockquotes
- Void elements like images
- And more

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
