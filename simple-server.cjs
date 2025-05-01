const express = require('express');

const app = express();
const PORT = 3003;

app.get('/', (req, res) => {
  res.send('CommonJS server is working!');
});

app.listen(PORT, () => {
  console.log(`CommonJS server running on port ${PORT}`);
}); 