// Prepare a login form webpage that loads two textboxes in the page and a submit button.
// 1) Input for a username
// 2) Input for a password
// 3) Submit button for Login.

// Add Bootstrap to the web application and load the button from Bootstrap styles using markup below:

// <button type="button" class="btn btn-success">Success</button>

// Submit the form after you have non-empty Username and Password on the page.

// Redirect to another page and show the Username and Secure encrypted hash of the Password in the second page.

// First line in the answer:
// Publish your code to github and add "matmaleki" as the collaborator for your project. And provide the github address as answer.

// Second line in the answer:
// Publish your code from your Github account on Cyclic and paste the Cyclic web address

const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bcrypt = require("bcrypt");

const HTTP_PORT = process.env.PORT || 8081;

// Register handlerbars as the rendering engine for views
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// Setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static("static"));

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Setup a route on the 'root' of the url to redirect to /index
app.get("/", (req, res) => {
  res.redirect("/index");
});

// Display the login html page
app.get("/index", function (req, res) {
  res.render("index", { layout: false });
});

// The login route that adds the user to the session
app.post("/index", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    // Render 'missing credentials'
    return res.render("index", {
      errorMsg: "Missing credentials.",
      layout: false,
    });
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      // Pass the username and hashed password as query parameters
      res.redirect(`/dashboard?username=${username}&password=${hash}`);
    });
  }
});

// Log a user out by destroying their session
// and redirecting them to /index
app.get("/logout", function (req, res) {
  res.redirect("/index");
});

app.get("/dashboard", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  res.render("dashboard", {
    username: username,
    password: password,
    layout: false,
  });
});

app.listen(HTTP_PORT, () => {
  console.log("Express http server listening on: " + HTTP_PORT);
});
