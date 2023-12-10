const express = require("express");
const app = express();
const PORT = 5000;

let users = { Navaneeth: "123456" };

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/login", express.static("public/loginpage.html"));

app.get("/", (req, res) => {
  res.status(200).redirect("/login");
});

app.get("/users/:name", (req, res) => {
  const name = req.params.name;
  console.log(name);

  if (name in users) {
    res.status(200).send(JSON.stringify(users));
  } else {
    res.status(404).redirect("/");
  }
});

app.post("/", (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;

  if (user in users && users[user] === pwd) {
    res.redirect(`/users/${user}`);
  } else {
    console.log("Invalid!");
    res.redirect("/");
  }
});

app.post("/createuser", (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;
  const email = req.body.email;

  if (!(user in users)) {
    users[user] = pwd;
    res.redirect("/");
  } else {
    console.log("Username taken");
    res.redirect("/signup.html");
  }
});

app.listen(PORT, () => {
  console.log(`Server live on http://localhost:${PORT}`);
});
