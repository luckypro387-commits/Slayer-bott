export interface MotdSegment {
  text: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  '0': '#000000', // black
  '1': '#0000aa', // dark_blue
  '2': '#00aa00', // dark_green
  '3': '#00aaaa', // dark_aqua
  '4': '#aa0000', // dark_red
  '5': '#aa00aa', // dark_purple
  '6': '#ffaa00', // gold
  '7': '#aaaaaa', // gray
  '8': '#555555', // dark_gray
  '9': '#5555ff', // blue
  'a': '#55ff55', // green
  'b': '#55ffff', // aqua
  'c': '#ff5555', // red
  'd': '#ff55ff', // light_purple
  'e': '#ffff55', // yellow
  'f': '#ffffff', // white
};

export function parseMotd(motdString: string): MotdSegment[] {
  if (!motdString) return [{ text: 'A Minecraft Server' }];

  // Clean raw escape code duplicates and convert formatting codes (§)
  const normalized = motdString
    .replace(/\\u00A7/g, '§')
    .replace(/&([0-9a-fk-or])/g, '§$1');

  const segments: MotdSegment[] = [];
  let currentSegment: Partial<MotdSegment> = { text: '' };

  let i = 0;
  while (i < normalized.length) {
    const char = normalized[i];

    if (char === '§' && i + 1 < normalized.length) {
      const code = normalized[i + 1].toLowerCase();
      i += 2;

      // Finish current segment if it has content
      if (currentSegment.text) {
        segments.push(currentSegment as MotdSegment);
      }

      if (code === 'r') {
        // Reset formatting
        currentSegment = { text: '' };
      } else if (COLOR_MAP[code]) {
        // Apply color (colors also reset style in official Minecraft client)
        currentSegment = { text: '', color: COLOR_MAP[code] };
      } else {
        // Apply style modifier
        const newSeg = { ...currentSegment, text: '' };
        if (code === 'l') newSeg.bold = true;
        if (code === 'o') newSeg.italic = true;
        if (code === 'n') newSeg.underlined = true;
        if (code === 'm') newSeg.strikethrough = true;
        currentSegment = newSeg;
      }
    } else {
      currentSegment.text = (currentSegment.text || '') + char;
      i++;
    }
  }

  if (currentSegment.text) {
    segments.push(currentSegment as MotdSegment);
  }

  return segments;
}

// Convert segments to clean text or HTML tags
export function renderMotdToHtml(motdString: string): string {
  const segments = parseMotd(motdString);
  return segments
    .map((seg) => {
      const styles: string[] = [];
      if (seg.color) styles.push(`color: ${seg.color}`);
      if (seg.bold) styles.push('font-weight: bold');
      if (seg.italic) styles.push('font-style: italic');
      
      const decoration: string[] = [];
      if (seg.underlined) decoration.push('underline');
      if (seg.strikethrough) decoration.push('line-through');
      if (decoration.length > 0) styles.push(`text-decoration: ${decoration.join(' ')}`);

      const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
      return `<span${styleAttr}>${escapeHtml(seg.text)}</span>`;
    })
    .join('');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
