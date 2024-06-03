const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const docRoutes = require('./routes/docRoutes');
const cors = require('cors');


require('dotenv').config();

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use('/apiauth', authRoutes); 
app.use('/doc', docRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
