const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3001;

app.use(bodyParser.json());

// Load existing suggestions from JSON file
const suggestionsFilePath = "./suggestions.json";

const getSuggestions = () => {
  if (fs.existsSync(suggestionsFilePath)) {
    return JSON.parse(fs.readFileSync(suggestionsFilePath, "utf-8"));
  }
  return [];
};

const saveSuggestions = (suggestions) => {
  fs.writeFileSync(suggestionsFilePath, JSON.stringify(suggestions, null, 2));
};

// Route to handle incoming suggestions
app.post("/suggestions", (req, res) => {
  const { userName, movieSuggestion } = req.body;
  if (!userName.trim() || !movieSuggestion.trim()) {
    return res.status(400).json({ error: "Both fields are required" });
  }

  const suggestions = getSuggestions();
  suggestions.push({ userName, movieSuggestion });
  saveSuggestions(suggestions);

  res.status(200).json({ message: "Suggestion submitted successfully!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
