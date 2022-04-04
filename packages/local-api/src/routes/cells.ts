import express from 'express';
import fs from 'fs';
import { writeFile } from 'fs/promises';

import path from 'path';
import { getFilename, serializeCells } from '../serializationFunctions';
import { checkCode } from '../typecheckingFunctions';

export interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}
export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    const notesParsed: string[] = [];
    try {
      const files = fs.readdirSync('./', 'utf-8');
      files.forEach((f) => {
        if (f.startsWith('code_') || f.startsWith('text_')) {
          notesParsed.push(JSON.parse(fs.readFileSync(f, 'utf-8')));
        }
      });
      res.send(notesParsed);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;
    await writeFile(fullPath, serializeCells(cells), 'utf-8');
    res.send({ status: 'ok' });
  });

  router.post('/cell', async (req, res) => {
    const { cell }: { cell: Cell } = req.body;

    const filename = getFilename(cell);
    await writeFile(filename, JSON.stringify(cell), 'utf-8');

    const diags = await checkCode(cell.id, cell.content);
    res.send({ status: 'ok', data: diags });
  });

  router.delete('/cell', async (req, res) => {
    const { cell }: { cell: Cell } = req.body;
    const filename = getFilename(cell);
    fs.unlinkSync(filename);
    res.send({ status: 'ok' });
  });

  // router.post('/typecheck', async (req, res) => {
  //   console.log('req :', req);
  //   res.send({ status: 'ok' });
  // });

  return router;
};
