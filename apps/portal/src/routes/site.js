/* eslint-disable @typescript-eslint/no-var-requires */
const { Router } = require('express');
const { site } = require('../config');

const router = Router();

router.get('/', (req, res) => res.render('index.html', site));

router.get('/contacts', (req, res) => res.render('contacts.html', site));
router.get('/features', (req, res) => res.render('features.html', site));
router.get('/feedback', (req, res) => res.render('feedback.html', site));
router.get('/localisation', (req, res) => res.render('localisation.html', site));
router.get('/open-source', (req, res) => res.render('open-source.html', site));
router.get('/output', (req, res) => res.render('output.html', site));
router.get('/publications', (req, res) => res.render('publications.html', site));
router.get('/recall', (req, res) => res.render('recall.html', site));
router.get('/validation', (req, res) => res.render('validation.html', site));

router.get('/privacy', (req, res) => res.render(`${site.content}/privacy.html`, site));
router.get('/terms', (req, res) => res.render(`${site.content}/terms.html`, site));

// Catch Not Found (404)
router.get('*', (req, res) => res.status(404).render('errors/404.html'));

module.exports = router;
