import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config(); // also load .env if it exists

console.log('Environment variables loaded from .env.local');
console.log('GMAIL_USER:', process.env.GMAIL_USER ? 'Present' : 'Missing');
console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? 'Present' : 'Missing');

