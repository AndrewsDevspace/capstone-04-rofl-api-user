import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const
  API_URL_END = "https://v2.jokeapi.dev/joke/Any",
  PAR_LAN_ENG = "?lang=en",
  PAR_SAFE = "&safe-mode",
  PAR_WORD = "&contains=";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const result = await axios.get(API_URL_END + PAR_LAN_ENG + PAR_SAFE);
  const jokeText = jokeApiData_htmlText_convert(result.data);
  res.render("jokes-root.ejs", { joke: jokeText });
});

app.post("/byword", async (req, res) => {
  const result = await axios.get(API_URL_END + PAR_LAN_ENG + PAR_WORD + req.body.word);
  const jokeText = jokeApiData_htmlText_convert(result.data);
  res.render("jokes-word.ejs", { joke: jokeText, word: req.body.word });
});

app.listen(port, () => {
  console.log(`Server listens on port : ${port}.`);
});



function jokeApiData_htmlText_convert(jokeData) {
  switch (jokeData.type) {
    case "single":
      return jokeData.joke.split("\n").join("<br>");
      //break;
    case "twopart":
      return jokeData.setup.split("\n").join("<br>") + "<br><br>" + jokeData.delivery.split("\n").join("<br>");
      //break;
    default:
      // Error!
      console.log("BUG: jokeData.type == '" + jokeData.type + "' not supported!");
      return "Error: unsupported joke-type found: '" + jokeData.type + "'!<br><br>Please contact the dev.";
      //break;
  }
}
