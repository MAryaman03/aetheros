export function chunkText(text, chunkSize = 800) {
  const chunks = [];
  let index = 0;

  while (index < text.length) {
    chunks.push(text.slice(index, index + chunkSize));
    index += chunkSize;
  }

  return chunks;
}