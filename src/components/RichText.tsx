import React from 'react'

type TextNode = {
  detail: number
  format: number
  mode: string
  style: string
  text: string
  type: string
  version: number
}

type ListItemNode = {
  children: Array<any>
  direction: string
  format: string
  indent: number
  type: string
  version: number
  value: number
  textFormat?: number
}

type ListNode = {
  children: Array<any>
  direction: string
  format: string
  indent: number
  type: string
  version: number
  listType: string
  start: number
  tag: string
}

type HeadingNode = {
  children: Array<any>
  direction: string
  format: string
  indent: number
  type: string
  version: number
  tag: string
}

type ParagraphNode = {
  children: Array<any>
  direction: string
  format: string
  indent: number
  type: string
  version: number
  textFormat?: number
  textStyle?: string
}

type RootNode = {
  children: Array<any>
  direction: string
  format: string
  indent: number
  type: string
  version: number
}

const RichText = ({ content }: { content: any }) => {
  if (!content || !content.root) return null

  const renderNode = (node: any, index: number) => {
    if (!node) return null

    // Handle text nodes
    if (node.type === 'text') {
      let className = ''
      if (node.format === 1) className = 'font-bold'
      if (node.format === 2) className = 'italic'
      if (node.format === 3) className = 'font-bold italic'

      return (
        <span key={index} className={className}>
          {node.text}
        </span>
      )
    }

    // Handle paragraphs
    if (node.type === 'paragraph') {
      return (
        <p key={index} className="mb-4">
          {node.children?.map(renderNode)}
        </p>
      )
    }

    // Handle headings
    if (node.type === 'heading') {
      switch (node.tag) {
        case 'h1':
          return (
            <h1 key={index} className="text-3xl font-bold mb-4">
              {node.children?.map(renderNode)}
            </h1>
          )
        case 'h2':
          return (
            <h2 key={index} className="text-2xl font-bold mb-3">
              {node.children?.map(renderNode)}
            </h2>
          )
        case 'h3':
          return (
            <h3 key={index} className="text-xl font-bold mb-2">
              {node.children?.map(renderNode)}
            </h3>
          )
        case 'h4':
          return (
            <h4 key={index} className="text-lg font-bold mb-2">
              {node.children?.map(renderNode)}
            </h4>
          )
        default:
          return (
            <h3 key={index} className="text-xl font-bold mb-2">
              {node.children?.map(renderNode)}
            </h3>
          )
      }
    }

    // Handle lists
    if (node.type === 'list') {
      if (node.listType === 'bullet') {
        return (
          <ul key={index} className="list-disc pl-6 mb-4">
            {node.children?.map(renderNode)}
          </ul>
        )
      } else {
        return (
          <ol key={index} className="list-decimal pl-6 mb-4">
            {node.children?.map(renderNode)}
          </ol>
        )
      }
    }

    // Handle list items
    if (node.type === 'listitem') {
      return (
        <li key={index} className="mb-1">
          {node.children?.map(renderNode)}
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
