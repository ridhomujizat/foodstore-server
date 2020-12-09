const path = require("path");
const dotenv = require(`dotenv`);
dotenv.config();

module.exports = {
  secretKey: process.env.SECRET_KEY,
  serviceName: process.env.SERVICE_NAME,

  //----config databases---//
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_USER,
  dbUser: process.env.DB_PORT,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,

  //root upload file
  rootPath: path.resolve(__dirname, ".."),
};
