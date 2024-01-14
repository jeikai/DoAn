const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const routers = require("./routes")
const connectDB = require('./config/database');
const errorMiddleware = require('./middleware/errorMiddleware')
const { log } = require('console')
const multer = require('multer');




dotenv.config();
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true, 
  })
  );  
connectDB();
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => {
//     console.log("Connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
app.use('/uploads', express.static('uploads'));
app.use(routers);

// error handling
app.use(function(err, req, res, next){

  const message = err.raw?.message || err.message || err.sqlMessage || null;

  console.error(err);
  log.create({ message: message, body: err, req: req });
  
  return res.status(500).send({ message: message });

});

// app.use(errorMiddleware)

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});