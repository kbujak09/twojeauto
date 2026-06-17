const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log('Serwer działa na porcie 3000');
});