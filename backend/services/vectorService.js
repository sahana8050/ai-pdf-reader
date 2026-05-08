import { getEmbeddings, isAIReady } from './aiService.js';

function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return 0;
  }
  const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  return magnitudeA === 0 || magnitudeB === 0 ? 0 : dotProduct / (magnitudeA * magnitudeB);
}

function textMatchScore(query, text) {
  const normalizedQuery = (query || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
  const normalizedText = (text || '').toLowerCase();
  const queryWords = Array.from(new Set(normalizedQuery.match(/\w+/g) || []));

  return queryWords.reduce((score, word) => {
    if (!word) return score;
    const count = normalizedText.split(word).length - 1;
    const boost = normalizedText.includes(word) ? 1 : 0;
    return score + Math.min(count, 2) + boost;
  }, 0);
}

function bm25Score(query, text, avgDocLength = 100, k1 = 1.5, b = 0.75) {
  const normalizedQuery = (query || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
  const normalizedText = (text || '').toLowerCase();
  const queryWords = Array.from(new Set(normalizedQuery.match(/\w+/g) || []));
  const docWords = normalizedText.match(/\w+/g) || [];
  const docLength = docWords.length;

  if (queryWords.length === 0 || docLength === 0) return 0;

  let score = 0;
  for (const word of queryWords) {
    const tf = docWords.filter(w => w === word).length;
    const idf = Math.log(1 + (1 / (1 + tf))); // Simplified IDF
    const numerator = tf * (k1 + 1);
    const denominator = tf + k1 * (1 - b + b * (docLength / avgDocLength));
    score += idf * (numerator / denominator);
  }

  return score;
}

function normalizeScore(score, max) {
  if (max === 0) return 0;
  return Math.min(Math.max(score / max, 0), 1);
}

function getChunkIndex(chunk) {
  const match = String(chunk.chunkId || '').match(/(\d+)$/);
  return match ? Number(match[1]) - 1 : 0;
}

function expandNeighbors(chunks, selectedChunks, windowSize = 1) {
  const expanded = new Map();
  selectedChunks.forEach((chunk) => {
    const index = getChunkIndex(chunk);
    for (let offset = -windowSize; offset <= windowSize; offset += 1) {
      const candidate = chunks[index + offset];
      if (candidate) {
        expanded.set(candidate.chunkId, candidate);
      }
    }
  });
  return Array.from(expanded.values());
}

export async function addEmbeddingsToChunks(chunks, filename) {
  const enriched = [];
  const useAI = isAIReady();
  
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const embedding = useAI ? await getEmbeddings(chunk.text) : null;
    enriched.push({
      chunkId: `${filename}-${i + 1}`,
      text: chunk.text,
      embedding: Array.isArray(embedding) ? embedding : [],
      source: `${filename}`,
      page: chunk.page || null,
      section: chunk.section || null
    });
  }
  return enriched;
}

export async function findRelevantChunks(query, chunks, topK = 5) {
  if (!query || !query.trim() || chunks.length === 0) {
    return [];
  }

  const useAI = isAIReady();

  // Calculate average document length for BM25
  const avgDocLength = chunks.reduce((sum, chunk) => sum + (chunk.text.match(/\w+/g) || []).length, 0) / chunks.length;

  const keywordScores = chunks.map((chunk) => ({
    chunk,
    keywordScore: textMatchScore(query, chunk.text),
    bm25Score: bm25Score(query, chunk.text, avgDocLength)
  }));

  if (useAI && chunks[0]?.embedding?.length > 0) {
    const queryEmbedding = await getEmbeddings(query);
    if (!queryEmbedding) {
      // Fallback if embedding fails
      return keywordScores
        .sort((a, b) => b.bm25Score - a.bm25Score)
        .slice(0, topK)
        .map(s => s.chunk);
    }

    const scored = chunks.map((chunk, index) => {
      const { keywordScore, bm25Score } = keywordScores[index];
      const semanticScore = chunk.embedding?.length ? cosineSimilarity(queryEmbedding, chunk.embedding) : 0;

      // Enhanced hybrid scoring: semantic (70%) + BM25 (20%) + keyword (10%)
      const combinedScore = semanticScore * 0.7 + bm25Score * 0.2 + normalizeScore(keywordScore, 8) * 0.1;

      return {
        ...chunk,
        semanticScore,
        keywordScore,
        bm25Score,
        score: combinedScore
      };
    });

    // First pass: get top candidates
    const topCandidates = scored
      .filter((item) => item.score > 0.01)
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(topK * 3, scored.length));

    // Expand with neighbors for context
    const expanded = expandNeighbors(chunks, topCandidates, 2);

    // Rerank expanded results
    const expandedScored = expanded.map((chunk) => {
      const existing = scored.find(s => s.chunkId === chunk.chunkId);
      if (existing) return existing;

      const keywordScore = textMatchScore(query, chunk.text);
      const bm25 = bm25Score(query, chunk.text, avgDocLength);
      const semanticScore = chunk.embedding?.length ? cosineSimilarity(queryEmbedding, chunk.embedding) : 0;
      const combinedScore = semanticScore * 0.7 + bm25 * 0.2 + normalizeScore(keywordScore, 8) * 0.1;

      return { ...chunk, semanticScore, keywordScore, bm25Score: bm25, score: combinedScore };
    });

    return expandedScored
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(topK + 6, expandedScored.length))
      .filter((chunk) => chunk.score >= 0.005);
  }

  // Fallback to keyword + BM25 scoring
  const scored = keywordScores.map(({ chunk, keywordScore, bm25Score }) => ({
    ...chunk,
    score: bm25Score * 0.7 + normalizeScore(keywordScore, 8) * 0.3
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((chunk) => chunk.score >= 0.01);
}
