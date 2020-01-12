const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/projetWeb';


mongoose.connect(MONGO_URL, { useNewUrlParser: true,
                              useUnifiedTopology: true,
                              useCreateIndex: true })
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB!');
    console.error(error);
  });