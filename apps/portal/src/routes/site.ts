import { Router } from 'express';
import config from '../config/site';

const router = Router();

router.get('/', (req, res) => res.render('index', config));

router.get('/contacts', (req, res) => res.render('contacts', config));
router.get('/features', (req, res) => res.render('features', config));
router.get('/feedback', (req, res) => res.render('feedback', config));
router.get('/localisation', (req, res) => res.render('localisation', config));
router.get('/open-source', (req, res) => res.render('open-source', config));
router.get('/output', (req, res) => res.render('output', config));
router.get('/publications', (req, res) => res.render('publications', config));
router.get('/recall', (req, res) => res.render('recall', config));
router.get('/validation', (req, res) => res.render('validation', config));
router.get('/privacy', (req, res) => res.render(`${config.content}/privacy`, config));
router.get('/terms', (req, res) => res.render(`${config.content}/terms`, config));

// Catch Not Found (404)
router.get('*', (req, res) => res.status(404).render('errors/404'));

export default router;
