import express from 'express';

const app = express();
const PORT = 3002;

app.get('/', (req, res) => {
  res.send('Simple server is working!');
});

app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
}); 