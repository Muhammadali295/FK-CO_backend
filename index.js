import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'https://www.fkandcoestate.com',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'FK&CO Estate API Server Operational' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server executing on http://localhost:${PORT}`);
  });
}

export default app;