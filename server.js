const express = require("express");
const connection = require("./database/database");
const app = express();
const PORT = 5000;

connection.connect();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/login", express.static("public/loginpage.html"));
app.use("/signup", express.static("public/signup.html"));

app.get("/", (req, res) => {
  res.status(200).redirect("/login");
});

app.get("/users/:name", (req, res) => {
  const name = req.params.name;

  connection.query(
    `select username, email from users where username='${name}'`,
    (err, rows, fields) => {
      res.send(`${rows[0].username}: ${rows[0].email}`);
    }
  );
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
          console.log(rows[0].password, pwd);
          console.log("Invalid Password");
          res.redirect("/");
        } else {
          res.redirect(`/users/${user}`);
        }
      }
    }
  );
});

app.post("/createuser", (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;
  const email = req.body.email;

  connection.query(
    `select username from users where username='${user}'`,
    (err, rows, fields) => {
      if (rows.length === 0) {
        connection.query(
          `insert into users values('${user}', '${email}', '${pwd}')`
        );
        console.log("Successful registration");
        res.redirect("/");
      } else {
        console.log("Username already exists");
        res.redirect("/signup");
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server live on http://localhost:${PORT}`);
});
