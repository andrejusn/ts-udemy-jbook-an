import { Cell } from '../src/routes/cells';
import { serializeCell, serializeCells } from '../src/serializationFunctions';

const textCell: Cell = {
  content: 'This is test commentary.\n\nonly to check',
  type: 'text',
  id: '14cr3',
};
const textCellSerialized =
  `/* text-14cr3 */\n` +
  `\n/*\n` +
  `This is test commentary.\n\nonly to check` +
  `\n*/\n`;
test('Serializes text cell', () => {
  expect(serializeCell(textCell)).toBe(textCellSerialized);
});

const codeCell: Cell = {
  content: 'const a = 12;\nshow(a);',
  type: 'code',
  id: 'o1cr3',
};
const codeCellSerialized =
  `/* code-o1cr3 */\n` + `\n` + `const a = 12;\nshow(a);` + `\n`;
test('Serializes code cell', () => {
  expect(serializeCell(codeCell)).toBe(codeCellSerialized);
});

const cellsDemoStringified =
  '/* ### JNotes ### */\n' + textCellSerialized + codeCellSerialized;
const cellsDemo: Cell[] = [textCell, codeCell];
test('Serializes notes data of text and code types', () => {
  expect(serializeCells(cellsDemo)).toBe(cellsDemoStringified);
});
