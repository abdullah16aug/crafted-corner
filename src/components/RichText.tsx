import React from 'react'

// Define a proper interface for the rich text content
interface RichTextContent {
  root: {
    children: Node[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

// Generic node interface
interface Node {
  type: string
  children?: Node[]
  [key: string]: unknown
}

// Text node
interface TextNode extends Node {
  type: 'text'
  text: string
  format?: number
}

// Paragraph node
interface ParagraphNode extends Node {
  type: 'paragraph'
  children: Node[]
}

// Heading node
interface HeadingNode extends Node {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: Node[]
}

// List node
interface ListNode extends Node {
  type: 'list'
  listType: 'bullet' | 'number'
  children: Node[]
}

// List item node
interface ListItemNode extends Node {
  type: 'listitem'
  children: Node[]
}

const RichText = ({ content }: { content: RichTextContent }) => {
  if (!content || !content.root) return null

  const renderNode = (node: Node, index: number) => {
    if (!node) return null

    // Handle text nodes
    if (node.type === 'text') {
      const textNode = node as TextNode
      let className = ''
      if (textNode.format === 1) className = 'font-bold'
      if (textNode.format === 2) className = 'italic'
      if (textNode.format === 3) className = 'font-bold italic'

      return (
        <span key={index} className={className}>
          {textNode.text}
        </span>
      )
    }

    // Handle paragraphs
    if (node.type === 'paragraph') {
      const paragraphNode = node as ParagraphNode
      return (
        <p key={index} className="mb-4">
          {paragraphNode.children?.map(renderNode)}
        </p>
      )
    }

    // Handle headings
    if (node.type === 'heading') {
      const headingNode = node as HeadingNode
      switch (headingNode.tag) {
        case 'h1':
          return (
            <h1 key={index} className="text-3xl font-bold mb-4">
              {headingNode.children?.map(renderNode)}
            </h1>
          )
        case 'h2':
          return (
            <h2 key={index} className="text-2xl font-bold mb-3">
              {headingNode.children?.map(renderNode)}
            </h2>
          )
        case 'h3':
          return (
            <h3 key={index} className="text-xl font-bold mb-2">
              {headingNode.children?.map(renderNode)}
            </h3>
          )
        case 'h4':
          return (
            <h4 key={index} className="text-lg font-bold mb-2">
              {headingNode.children?.map(renderNode)}
            </h4>
          )
        default:
          return (
            <h3 key={index} className="text-xl font-bold mb-2">
              {headingNode.children?.map(renderNode)}
            </h3>
          )
      }
    }

    // Handle lists
    if (node.type === 'list') {
      const listNode = node as ListNode
      if (listNode.listType === 'bullet') {
        return (
          <ul key={index} className="list-disc pl-6 mb-4">
            {listNode.children?.map(renderNode)}
          </ul>
        )
      } else {
        return (
          <ol key={index} className="list-decimal pl-6 mb-4">
            {listNode.children?.map(renderNode)}
          </ol>
        )
      }
    }

    // Handle list items
    if (node.type === 'listitem') {
      const listItemNode = node as ListItemNode
      return (
        <li key={index} className="mb-1">
          {listItemNode.children?.map(renderNode)}
        </li>
      )
    }

    // Fallback for other node types or root
    if (node.children) {
      return <React.Fragment key={index}>{node.children.map(renderNode)}</React.Fragment>
    }

    return null
  }

  return <div className="rich-text">{content.root.children.map(renderNode)}</div>
}

export default RichText
