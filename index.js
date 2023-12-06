import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("jokes-root.ejs");
});

app.post("/byword", (req, res) => {
  res.render("jokes-word.ejs");
});

app.listen(port, () => {
  console.log(`Server listens on port : ${port}.`);
});
