/**
 * AchSwap Documentation Indexer
 * 
 * Recursively discovers all .md/.mdx files under docs/
 * Chunks intelligently by headings (H1/H2/H3)
 * Generates free local embeddings using BAAI/bge-small-en-v1.5 (via Xenova)
 * Stores vectors + rich metadata in Qdrant for RAG
 * 
 * Usage:
 *   npm run index-docs
 *   npm run index-docs:force     # reindex everything
 *
 * Requirements:
 *   - Qdrant running (docker run -p 6333:6333 qdrant/qdrant)
 *   - Set QDRANT_URL and QDRANT_COLLECTION in .env
 */

import 'dotenv/config';
import { glob } from 'glob';
import matter from 'gray-matter';
import { QdrantClient } from '@qdrant/qdrant-js';
import { pipeline, Pipeline } from '@xenova/transformers';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// ----------------------------- CONFIG -----------------------------
const DOCS_DIR = 'docs';
const CACHE_FILE = '.doc-index-cache.json';
const COLLECTION = process.env.QDRANT_COLLECTION || 'achswap-docs';
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || undefined;
const EMBED_MODEL = process.env.EMBED_MODEL || 'Xenova/bge-small-en-v1.5';
const VECTOR_DIM = 384; // bge-small-en-v1.5
const CHUNK_MAX_CHARS = 1600;
const TOP_HEADING_LEVELS = [1, 2, 3];

const FORCE = process.argv.includes('--force') || process.argv.includes('-f');
const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('--dry');

// ----------------------------- TYPES -----------------------------
interface DocMetadata {
  title: string;
  heading: string;
  url: string;
  filePath: string;
  breadcrumb: string;
}

interface DocChunk {
  content: string; // enriched text for embedding + context to LLM
  metadata: DocMetadata;
}

interface Cache {
  [filePath: string]: string; // path -> content hash
}

// ----------------------------- HELPERS -----------------------------
function sha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function filePathToDocUrl(filePath: string): string {
  // docs/achswap/swap.md -> /achswap/swap
  // docs/introduction.md -> /introduction
  let rel = filePath
    .replace(/\\/g, '/')
    .replace(new RegExp(`^${DOCS_DIR}/`), '')
    .replace(/\.mdx?$/, '');

  // Special case: root introduction becomes /introduction (matches sidebar + observed build)
  if (rel === 'introduction') return '/introduction';
  if (rel === 'index' || rel === '') return '/';

  return '/' + rel;
}

function buildBreadcrumb(title: string, headingStack: string[]): string {
  const parts = [title, ...headingStack].filter(Boolean);
  return parts.join(' › ');
}

function generatePointId(filePath: string, heading: string): string {
  // Stable string id
  return md5(`${filePath}:${heading}`);
}

async function loadCache(): Promise<Cache> {
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveCache(cache: Cache): Promise<void> {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// ----------------------------- MARKDOWN CHUNKING -----------------------------
function extractTitleFromContent(content: string, fallback: string): string {
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return fallback;
}

function splitIntoChunks(filePath: string, rawMarkdown: string): DocChunk[] {
  const { data: frontmatter, content: md } = matter(rawMarkdown);

  const fileBase = path.basename(filePath, path.extname(filePath));
  let pageTitle = (frontmatter.title as string) || '';

  const urlBase = filePathToDocUrl(filePath);

  const chunks: DocChunk[] = [];
  const lines = md.split('\n');

  let currentH1 = '';
  let currentH2 = '';
  let currentH3 = '';
  let buffer: string[] = [];

  function flushChunk(heading: string, headingStack: string[]) {
    const text = buffer.join('\n').trim();
    if (!text && !heading) return;

    let combined = '';
    if (heading) combined += `${heading}\n\n`;
    combined += text;

    // Cap very long sections
    if (combined.length > CHUNK_MAX_CHARS) {
      combined = combined.slice(0, CHUNK_MAX_CHARS) + '\n...';
    }

    const breadcrumb = buildBreadcrumb(pageTitle || currentH1 || fileBase, headingStack);
    const url = heading
      ? `${urlBase}#${slugify(heading)}`
      : urlBase;

    chunks.push({
      content: combined,
      metadata: {
        title: pageTitle || currentH1 || fileBase,
        heading: heading || pageTitle || currentH1 || fileBase,
        url,
        filePath,
        breadcrumb,
      },
    });

    buffer = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h1Match = line.match(/^#\s+(.+)/);
    const h2Match = line.match(/^##\s+(.+)/);
    const h3Match = line.match(/^###\s+(.+)/);

    if (h1Match) {
      flushChunk(currentH3 || currentH2 || currentH1, getHeadingStack());
      currentH1 = h1Match[1].trim();
      currentH2 = '';
      currentH3 = '';
      pageTitle = pageTitle || currentH1;
      buffer = [];
      continue;
    }

    if (h2Match) {
      flushChunk(currentH3 || currentH2, getHeadingStack());
      currentH2 = h2Match[1].trim();
      currentH3 = '';
      buffer = [];
      continue;
    }

    if (h3Match) {
      flushChunk(currentH3, getHeadingStack());
      currentH3 = h3Match[1].trim();
      buffer = [];
      continue;
    }

    buffer.push(line);
  }

  // Flush remaining
  const lastHeading = currentH3 || currentH2 || currentH1;
  flushChunk(lastHeading, getHeadingStack());

  // Ensure we always have at least one chunk for the whole page if nothing was produced
  if (chunks.length === 0) {
    const full = md.trim().slice(0, CHUNK_MAX_CHARS);
    chunks.push({
      content: full || 'No content',
      metadata: {
        title: pageTitle || fileBase,
        heading: pageTitle || fileBase,
        url: urlBase,
        filePath,
        breadcrumb: pageTitle || fileBase,
      },
    });
  }

  // Enrich chunk content for better retrieval (attach breadcrumb + title context)
  return chunks.map((chunk) => ({
    ...chunk,
    content: `${chunk.metadata.breadcrumb}\n\n${chunk.content}`,
  }));

  function getHeadingStack(): string[] {
    const stack: string[] = [];
    if (currentH1) stack.push(currentH1);
    if (currentH2) stack.push(currentH2);
    if (currentH3) stack.push(currentH3);
    return stack;
  }
}

// ----------------------------- QDRANT -----------------------------
async function ensureCollection(client: QdrantClient, name: string): Promise<void> {
  const collections = await client.getCollections();
  const exists = collections.collections.some((c) => c.name === name);

  if (!exists) {
    console.log(`Creating collection "${name}" (dim=${VECTOR_DIM})...`);
    await client.createCollection(name, {
      vectors: {
        size: VECTOR_DIM,
        distance: 'Cosine',
      },
      optimizers_config: {
        default_segment_number: 2,
      },
    });
  }
}

async function deletePointsForFile(client: QdrantClient, filePath: string): Promise<void> {
  try {
    await client.delete(COLLECTION, {
      filter: {
        must: [
          {
            key: 'filePath',
            match: { value: filePath },
          },
        ],
      },
    });
  } catch (err) {
    // Collection may be empty — ignore
  }
}

// ----------------------------- EMBEDDINGS -----------------------------
let embedderPromise: Promise<Pipeline> | null = null;

async function getEmbedder(): Promise<Pipeline> {
  if (!embedderPromise) {
    console.log(`Loading local embedding model: ${EMBED_MODEL} (first run downloads ~30-50MB)...`);
    embedderPromise = pipeline('feature-extraction', EMBED_MODEL, {
      quantized: true,
    });
  }
  return embedderPromise;
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  const embedder = await getEmbedder();
  const vectors: number[][] = [];

  // Process sequentially to be gentle on CPU / memory
  for (const text of texts) {
    const output = await embedder(text, {
      pooling: 'mean',
      normalize: true,
    });
    // output is a Tensor; .data is Float32Array
    vectors.push(Array.from(output.data as Float32Array));
  }
  return vectors;
}

// ----------------------------- MAIN -----------------------------
async function main() {
  console.log('🚀 AchSwap Docs Indexer starting...');
  console.log(`Qdrant: ${QDRANT_URL}`);
  console.log(`Collection: ${COLLECTION}`);
  console.log(`Force reindex: ${FORCE}`);
  console.log(`Dry run: ${DRY_RUN}`);

  const client = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
  });

  if (!DRY_RUN) {
    await ensureCollection(client, COLLECTION);
  } else {
    console.log('[DRY RUN] Skipping Qdrant connection and collection creation.');
  }

  const cache = await loadCache();
  let newCache: Cache = { ...cache };

  const pattern = `${DOCS_DIR}/**/*.{md,mdx}`;
  const files = await glob(pattern, {
    ignore: ['**/node_modules/**', '**/.*/**'],
    absolute: false,
  });

  console.log(`Found ${files.length} documentation files.`);

  const embedder = await getEmbedder(); // preload early
  void embedder; // keep reference

  let indexedCount = 0;
  let skippedCount = 0;
  let totalChunks = 0;

  for (const file of files) {
    const absolutePath = path.resolve(file);
    const raw = await fs.readFile(absolutePath, 'utf8');
    const hash = sha256(raw);

    if (!FORCE && cache[file] === hash) {
      skippedCount++;
      newCache[file] = hash; // keep it
      continue;
    }

    console.log(`\n📄 Processing: ${file}`);

    const chunks = splitIntoChunks(file, raw);
    if (chunks.length === 0) continue;

    if (!DRY_RUN) {
      // Delete old points belonging to this file
      await deletePointsForFile(client, file);
    }

    // Embed
    const textsForEmbed = chunks.map((c) => c.content);
    const vectors = await embedTexts(textsForEmbed);

    // Prepare points
    const points = chunks.map((chunk, idx) => ({
      id: generatePointId(chunk.metadata.filePath, chunk.metadata.heading),
      vector: vectors[idx],
      payload: {
        ...chunk.metadata,
        // Store the clean readable context (we already enriched content)
        content: chunk.content,
      },
    }));

    if (!DRY_RUN && points.length > 0) {
      await client.upsert(COLLECTION, { points });
      totalChunks += points.length;
      console.log(`   → Indexed ${points.length} chunks`);
    } else if (DRY_RUN) {
      console.log(`   → [DRY] Would index ${points.length} chunks`);
      totalChunks += points.length;
    }

    newCache[file] = hash;
    indexedCount++;
  }

  // Remove stale entries from cache for deleted files
  const currentFileSet = new Set(files);
  for (const cachedFile of Object.keys(newCache)) {
    if (!currentFileSet.has(cachedFile)) {
      delete newCache[cachedFile];
      // Best effort: delete any leftover points
      try {
        await client.delete(COLLECTION, {
          filter: { must: [{ key: 'filePath', match: { value: cachedFile } }] },
        });
      } catch {}
    }
  }

  await saveCache(newCache);

  console.log('\n✅ Indexing complete.');
  console.log(`   Files processed: ${indexedCount}`);
  console.log(`   Files skipped (unchanged): ${skippedCount}`);
  console.log(`   Total chunks upserted this run: ${totalChunks}`);
  console.log(`   Cache saved to ${CACHE_FILE}`);
}

main().catch((err) => {
  console.error('❌ Indexing failed:', err);
  process.exit(1);
});
