import 'dotenv/config';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const API = process.env.API_URL || 'http://localhost:3001';
const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
if (!secret) {
  console.error('Missing JWT secret in env (JWT_ACCESS_SECRET or JWT_SECRET)');
  process.exit(1);
}

const token = jwt.sign({ userId: 1, email: 'test@local' }, secret, { expiresIn: '1h' });

const images = [
  'https://picsum.photos/seed/p1/1080/1440',
  'https://picsum.photos/seed/p2/1080/1440',
  'https://picsum.photos/seed/p3/1080/1440',
];

console.log('Calling', `${API}/api/timelapse/generate`);

const resp = await fetch(`${API}/api/timelapse/generate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ images, fps: 1 }),
});

const text = await resp.text();
console.log('Status:', resp.status);
console.log(text);

if (resp.ok) {
  try {
    const json = JSON.parse(text);
    console.log('Result URL:', json.url);
  } catch (e) {}
}
