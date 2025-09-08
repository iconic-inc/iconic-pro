import * as cheerio from 'cheerio';
const EXCERPT_LENGTH = 150;

/**
 * Extracts an excerpt from EditorJS content
 * @param content - content in JSON format
 * @returns
 */
const getExcerpt = (content: string): string => {
  if (!content) {
    return '';
  }

  const { blocks, ...attrs } = JSON.parse(content || '{}');
  let excerpt = '';
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'paragraph') {
      excerpt = blocks[i].data.text;

      if (excerpt.length > 100) {
        excerpt = excerpt.slice(0, EXCERPT_LENGTH);
        excerpt += '...';
        break;
      }
    }
  }

  return JSON.stringify({
    blocks: [{ type: 'paragraph', data: { text: excerpt } }],
    ...attrs,
  });
};

/**
 * Extracts a text excerpt from HTML
 * @param {string} html - full HTML content
 * @param {number} maxLength - max length of excerpt (in characters)
 * @returns {string}
 */
function extractExcerpt(html: string, maxLength = 200) {
  const $ = cheerio.load(html);

  // Extract text content
  const text = $.text().replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trim() + '…';
}

export { getExcerpt, extractExcerpt };
