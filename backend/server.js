import expess from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = expess();
const PORT = process.env.PORT || 4000;



// MIDDLEWARE

//DB

//ROUTES
app.get('/', (req, res) => {
  res.send('API Working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});