import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NovelRealm production server running on port ${PORT}`);
});
