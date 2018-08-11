const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./db/db.js");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("./db/bcrypt.js");
//const cookieParser = require("cookies-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.engine(
    "handlebars",
    hb({
        defaultLayout: "main"
    })
);

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.set("view engine", "handlebars");

app.get("/home", (req, res) => {
    if (req.session.loggedIn != true) {
        res.redirect("/login");
    } else {
        res.render("home", {
            //remember: res.render is for template
            layout: "main"
        });
    }
    //db.getSigners()
});


app.get("/", (req, res) => {
    req.session.loggedIn != true;
    res.render("home"); // when the user type "/register", user will be redirected to the register view
});


app.get("/login", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.redirect("/login");
    } else {
        res.render("login");
    }
});


app.listen(process.env.PORT || 8080, () => {
    console.log("listening to petition...");
});
