/* eslint-disable @typescript-eslint/no-var-requires */
const { Router } = require('express');
const path = require('path');
const { app } = require('../config');

const router = Router();

router.get('*', (req, res) => res.sendFile(path.resolve(app.static, 'index.html')));

module.exports = router;
