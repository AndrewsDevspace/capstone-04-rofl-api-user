import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const
  API_URL_END = "https://v2.jokeapi.dev/joke/Any",
  PAR_LAN_ENG = "?lang=en",
  PAR_SAFE = "&safe-mode",
  PAR_WORD = "&contains=";
const BAD_CHARS = [
  ":", "/", ".", ",", ";", "_", "*", "+",
  "'", '"', "`",
  "~", "^", "°",
  "[", "]", "(", ")", "{", "}", "<", ">",
  "!", "?"
];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const result = await axios.get(API_URL_END + PAR_LAN_ENG + PAR_SAFE);
    const jokeText = jokeApiData_htmlText_convert(result.data);
    res.render("jokes-root.ejs", { joke: jokeText });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("jokes-root.ejs", { joke: "Server Error!<br>Sorry about that." });
  }
  
});

app.post("/byword", async (req, res) => {
  // Filter out some invalid search characters:
  let checkedWord = req.body.word;
  {
    // Replace bad chars with spaces:
    BAD_CHARS.forEach((charItem) => checkedWord = stringReplace(checkedWord, charItem, " "));
    // Trim whitespace:
    checkedWord = checkedWord.trim();
    // If turns into empty string:
    if (checkedWord.length === 0) {
      console.log("USER ERROR: invalid search word input. ('" + req.body.word + "')");
      res.status(400).render("jokes-word.ejs", {
        joke: "User Error!<br>Invalid or empty input.<br>{ " + BAD_CHARS.slice(0, 5).join(" ") + " etc. } characters are removed!",
        word: checkedWord
      });
      return;
    }
    // Else search for the first word given:
    checkedWord = checkedWord.split(" ")[0];
  }
  // Convert to URI standard:
  const uriFormattedWord = encodeURIComponent(checkedWord);
  try {
    const result = await axios.get(API_URL_END + PAR_LAN_ENG + PAR_WORD + uriFormattedWord);
    const jokeText = jokeApiData_htmlText_convert(result.data);
    res.render("jokes-word.ejs", { joke: jokeText, word: checkedWord });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("jokes-word.ejs", { joke: "Server Error!<br>Sorry about that.", word: checkedWord });
  }
  
});

app.listen(port, () => {
  console.log(`Server listens on port : ${port}.`);
});



/* * * * * * * * * *
*  Helper Functions *
* * * * * * * * * */

function jokeApiData_htmlText_convert(jokeData) {
  if (jokeData.error) {
    return jokeData.message;
  } else {
    switch (jokeData.type) {
      case "single":
        //return jokeData.joke.split("\n").join("<br>");
        return stringReplace(jokeData.joke, "\n", "<br>");

      case "twopart":
        //return jokeData.setup.split("\n").join("<br>") + "<br><br>" + jokeData.delivery.split("\n").join("<br>");
        return stringReplace(jokeData.setup, "\n", "<br>") + "<br><br>" + stringReplace(jokeData.delivery, "\n", "<br>");

      default:
        // Error!
        console.log("BUG: jokeData.type == '" + jokeData.type + "' not supported!");
        return "Error: unsupported joke-type found: '" + jokeData.type + "'!<br><br>Please contact the dev.";
    }
  }
}

function stringReplace(inStr, subS1, subS2) {
  return inStr.split(subS1).join(subS2);
}
