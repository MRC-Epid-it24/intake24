import { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import fsConfig from '@api/config/filesystem';

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
