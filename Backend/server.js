require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use(require("./routes/authRoutes"));
app.use(require("./routes/userRoutes"));
app.use(require("./routes/petRoutes"));

app.get("/", (req, res) => {
  res.send("server is working now");
});


app.listen(process.env.PORT || 5000, () => {
  console.log("Server started");
});
