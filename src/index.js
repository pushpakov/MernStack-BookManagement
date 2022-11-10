const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const app = express();
const cors = require('cors');


app.use(bodyParser.json());
app.use(multer().any());
app.use(cors());


mongoose
.connect(
    "mongodb+srv://pushpak:pushpak1819@radoncluster.opqe2.mongodb.net/group1Database?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch( err => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3001, function () {
  console.log("Express app running on port " + (process.env.PORT || 3001));
});
