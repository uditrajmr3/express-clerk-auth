const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('err.name', err.name);
  console.log('err.message', err.message);
  console.log('uncaughtException!!');
  process.exit(1);
});

dotenv.config({ path: './config/.env.local' });
const app = require('./app');

// constants here
const { PORT, DATABASE_CONNECTION_STRING, DATABASE_PASSWORD } = process.env;
const db = DATABASE_CONNECTION_STRING.replace('<PASSWORD>', DATABASE_PASSWORD);

mongoose
  .connect(db)
  .then((_) => {
    console.log(`Connected to database`);
  })
  .catch((err) => {
    console.log(`Something went wrong! Can't connect to database`);
    console.log(`Error: ${err}`);
  });

// server related code here
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

process.on('MongoServerError', (err) => {
  console.log(err.name, err.message);
  console.log('Unable to connect to database. Shutting down server!!');
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Something Unexpected Happend. Shutting down server!!');
  server.close(() => {
    process.exit(1);
  });
});
