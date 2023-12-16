const express = require("express");
const mysql = require("mysql");
const app = express();
const PORT = 5000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "code_editor",
});

connection.connect();

let users = { Navaneeth: "123456" };

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/login", express.static("public/loginpage.html"));
app.use("/signup", express.static("public/signup.html"));

app.get("/", (req, res) => {
  res.status(200).redirect("/login");
});

app.get("/users/:name", (req, res) => {
  const name = req.params.name;
  console.log(name);
  res.status(200).send(JSON.stringify(users));

  // if (name in users) {
  //   res.status(200).send(JSON.stringify(users));
  // } else {
  //   res.status(404).redirect("/");
  // }
});

app.post("/", (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;

  connection.query(
    `select password from users where username='${user}'`,
    (err, rows, fields) => {
      if (err) throw err;
      console.log(rows);
      if (rows.length == 0) {
        console.log("Invalid username!");
        res.redirect("/");
      } else {
        if (rows[0].password != pwd) {
          console.log("Invalid Password");
          res.redirect("/");
        } else {
          res.redirect(`/users/${user}`);
        }
      }
    }
  );
  // if (user in users && users[user] === pwd) {
  //   res.redirect(`/users/${user}`);
  // } else {
  //   console.log("Invalid!");
  //   res.redirect("/");
  // }
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
