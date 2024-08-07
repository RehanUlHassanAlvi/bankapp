const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const docRoutes = require('./routes/docRoutes');
const userDetailsRoutes = require('./routes/userRoutes');
const docTypesRoutes = require('./routes/docTypesRoutes')
const allDocumentsRoutes = require('./routes/allDocumentRoutes');
const reqDocumentRoute = require('./routes/requestedDocumentsRoutes');



const cors = require('cors');


require('dotenv').config();

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use('/apiauth', authRoutes); 
app.use('/user',userDetailsRoutes)
app.use('/document', docRoutes);
app.use('/docTypes',docTypesRoutes)
app.use('/documents',allDocumentsRoutes)
app.use('/requestedDoc',reqDocumentRoute)

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
