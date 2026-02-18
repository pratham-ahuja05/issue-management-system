export default function KeywordHighlight({ text, keywords = [] }) {
  if (!keywords || keywords.length === 0) return <span>{text}</span>

  let highlightedText = text
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi')
    highlightedText = highlightedText.replace(
      regex,
      '<mark class="bg-blue-500/20 text-blue-300 px-1 rounded">$1</mark>'
    )
  })

  return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
}
