import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'FK&CO Estate API Server Operational' });
});

app.listen(PORT, () => {
  console.log(`Server executing on http://localhost:${PORT}`);
});