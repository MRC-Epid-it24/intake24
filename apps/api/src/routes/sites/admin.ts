import type { Request, Response } from 'express';
import { Router } from 'express';
import path from 'node:path';
import fs from 'fs-extra';
import fsConfig from '@intake24/api/config/filesystem';

const router = Router();

router.get('*', (req: Request, res: Response): void => {
  const index = path.resolve(fsConfig.local.public, 'admin', 'index.html');

  fs.access(index, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send();
      return;
    }

    res.sendFile(index);
  });
});

export default router;
