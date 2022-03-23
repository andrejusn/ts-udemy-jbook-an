import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { serializeCells } from '../serializationFunctions';

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
    try {
      const result = await fs.readFile(fullPath, 'utf-8');
      res.send(JSON.parse(result));
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(fullPath, serializeCells(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  router.post('/cell', async (req, res) => {
    const { cell }: { cell: Cell } = req.body;

    const directoryFullPath = path.join(dir, 'js_notes');

    // create the directory for notes if none exists
    try {
      fs.mkdir(directoryFullPath);
    } catch (e: any) {
      if (e.code != 'EEXIST') throw e;
    }

    console.log('cell.id', cell.id);
    await fs.writeFile(
      directoryFullPath + cell.type + '_' + cell.id,
      JSON.stringify(cell),
      'utf-8'
    );

    res.send({ status: 'ok' });
  });

  return router;
};
