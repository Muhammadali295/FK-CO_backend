import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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