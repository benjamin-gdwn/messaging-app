const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello, World!");
  console.log(req);
});

app.use("/auth", authRoutes);

app.listen(5000, () => {
  console.log(`Server running on port ${PORT}`);
});
