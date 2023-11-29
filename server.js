const http = require('http');
const app = require('./src/app');
const port = process.env.PORT || 3000;
const connectDB = require('./src/db/connect');
require('dotenv').config();

const startApp = http.createServer(app);

const server = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    startApp.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

server();

module.exports = server;
