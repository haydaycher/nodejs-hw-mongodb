import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const API_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
