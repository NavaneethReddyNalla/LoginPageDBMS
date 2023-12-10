const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/loginpage.html");
});

app.listen(PORT, () => {
  console.log(`Server live on http://localhost:${PORT}`);
});
