export function splitTextToChunks(rawText, pageCount = null) {
  const chunkSize = 1000;
  const chunkOverlap = 200;
  const normalizedText = rawText
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n {1,}/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const paragraphs = normalizedText.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);
  const chunks = [];

  const pageLength = pageCount ? Math.max(1, Math.floor(normalizedText.length / pageCount)) : null;
  let chunkIndex = 0;
  let cursor = 0;
  let section = 1;
  let current = '';
  let currentStart = 0;

  function pushChunk() {
    if (!current.trim()) return;
    const page = pageLength ? Math.min(pageCount, Math.max(1, Math.ceil((currentStart + 1) / pageLength))) : null;
    chunks.push({
      text: current.trim(),
      chunkId: `chunk-${chunkIndex + 1}`,
      page,
      section
    });
    chunkIndex += 1;
    current = '';
  }

  for (const paragraph of paragraphs) {
    if (/^(?:Section|Chapter|Part|Appendix)\b|^[0-9]+(?:\.[0-9]+)*\s+[A-Z]/.test(paragraph) || (paragraph.length < 120 && /:$/.test(paragraph))) {
      section += 1;
    }

    const sentences = paragraph.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [paragraph];
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) {
        cursor += sentence.length;
        continue;
      }

      if (!current) {
        currentStart = cursor;
      }

      if ((current + ' ' + trimmed).trim().length > chunkSize) {
        pushChunk();
        currentStart = cursor;
        current = trimmed;
      } else {
        current += current ? ` ${trimmed}` : trimmed;
      }

      cursor += sentence.length;
    }

    if (current && current.length > chunkSize * 0.75) {
      pushChunk();
    }
  }

  if (current.trim()) {
    pushChunk();
  }

  // Fallback: if no chunks were created but we have text, create at least one chunk
  if (chunks.length === 0 && normalizedText.trim()) {
    chunks.push({
      text: normalizedText.trim(),
      chunkId: 'chunk-1',
      page: 1,
      section: 1
    });
  }

  return chunks;
}
