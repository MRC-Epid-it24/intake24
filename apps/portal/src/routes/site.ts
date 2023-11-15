import { Router } from 'express';

import site from '../config/site';

const router = Router();

router.get('/', (req, res) => res.render('index'));

router.get('/contacts', (req, res) => res.render('contacts'));
router.get('/features', (req, res) => res.render('features'));
router.get('/feedback', (req, res) => res.render('feedback'));
router.get('/localisation', (req, res) => res.render('localisation'));
router.get('/open-source', (req, res) => res.render('open-source'));
router.get('/output', (req, res) => res.render('output'));
router.get('/publications', (req, res) => res.render('publications'));
router.get('/recall', (req, res) => res.render('recall'));
router.get('/validation', (req, res) => res.render('validation'));
router.get('/privacy', (req, res) => res.render(`${site.content}/privacy`));
router.get('/terms', (req, res) => res.render(`${site.content}/terms`));

router.get('/info/:section', (req, res) => res.redirect(301, `/${req.params.section}`));

// Catch Not Found (404)
router.get('*', (req, res) => res.status(404).render('errors/404'));

export default router;
