import { Cell } from './routes/cells';

export function serializeCell(cell: Cell): string {
  if (cell.type === 'code') {
    return `/* code-${cell.id} */\n` + `\n` + cell.content + `\n`;
  } else if (cell.type === 'text') {
    return `/* text-${cell.id} */\n` + `\n/*\n` + cell.content + `\n*/\n`;
  } else {
    return `/* text-${cell.id} */\n` + `\n` + cell.content + `\n`;
  }
}

export function serializeCells(cells: Cell[]): string {
  const result =
    '/* ### JNotes ### */\n' + cells.map((c) => serializeCell(c)).join('');

  return result;
}

function getFilenameExtension(cell: Cell) {
  return cell.type === 'code' ? '.jsx' : '.txt';
}

export function getFilename(cell: Cell): string {
  return cell.type + '_' + cell.id + getFilenameExtension(cell);
}
