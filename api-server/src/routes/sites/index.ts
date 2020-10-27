import { Router } from 'express';
import admin from './admin';
import docs from './docs';
import survey from './survey';

const sites: Record<string, Router> = { admin, docs, survey };

export default sites;
