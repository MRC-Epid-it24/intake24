import { Router } from 'express';
import config from '../config/site';

const router = Router();

router.get('/', (req, res) => res.render('index.html', config));

router.get('/contacts', (req, res) => res.render('contacts.html', config));
router.get('/features', (req, res) => res.render('features.html', config));
router.get('/feedback', (req, res) => res.render('feedback.html', config));
router.get('/localisation', (req, res) => res.render('localisation.html', config));
router.get('/open-source', (req, res) => res.render('open-source.html', config));
router.get('/output', (req, res) => res.render('output.html', config));
router.get('/publications', (req, res) => res.render('publications.html', config));
router.get('/recall', (req, res) => res.render('recall.html', config));
router.get('/validation', (req, res) => res.render('validation.html', config));
router.get('/privacy', (req, res) => res.render(`${config.content}/privacy.html`, config));
router.get('/terms', (req, res) => res.render(`${config.content}/terms.html`, config));

// Catch Not Found (404)
router.get('*', (req, res) => res.status(404).render('errors/404.html'));

export default router;
