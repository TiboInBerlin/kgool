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

app.get("/", (req, res) => {
        req.session.loggedIn != true;
    res.render("welcome"); // when the user type "/register", user will be redirected to the register view
});

app.get("/welcome", (req, res) => {
    if (req.session.loggedIn != true) {
        res.render("welcome", {
            //remember: res.render is for template
            layout: "main"
        });
    } else {
        res.render("welcome", {
            //remember: res.render is for template
            layout: "main"
        });
    }
    //db.getSigners()
});

app.get("/login", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("login");
    } else {
        res.render("login");
    }
});

app.get("/registerCustomer", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("registerCustomer");
    } else {
        res.render("registerCustomer");
    }
});

app.get("/registerProducer", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("registerProducer");
    } else {
        res.render("registerProducer");
    }
});

app.get("/profileProducer", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("profileProducer");
    } else {
        res.render("profileProducer");
    }
});

app.get("/kundenInformation", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("kundenInformation");
    } else {
        res.render("kundenInformation");
    }
});

app.get("/weitereInfo", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("weitereInfo");
    } else {
        res.render("weitereInfo");
    }
});

app.get("/Favoriten", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("Favoriten");
    } else {
        res.render("Favoriten");
    }
});

app.get("/presentationProducerSide", (req, res) => {
    //in the sget, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("presentationProducerSide");
    } else {
        res.render("presentationProducerSide");
    }
});

app.get("/profileCustomer", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("profileCustomer");
    } else {
        res.render("profileCustomer");
    }
});

app.get("/kundenInformationCustomer", (req, res) => {
    //in the sget, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("kundenInformationCustomer");
    } else {
        res.render("kundenInformationCustomer");
    }
});

app.get("/lieblingsfirmen", (req, res) => {
    //in the sget, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("lieblingsfirmen");
    } else {
        res.render("lieblingsfirmen");
    }
});

app.get("/contactProducerPage", (req, res) => {
    //in the sget, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("contactProducerPage");
    } else {
        res.render("contactProducerPage");
    }
});

app.get("/presentationProducerSide", (req, res) => {
    //in the sget, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("presentationProducerSide");
    } else {
        res.render("presentationProducerSide");
    }
});

app.get("/presentationCustomerSide", (req, res) => {
    //in the sget, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("presentationCustomerSide");
    } else {
        res.render("presentationCustomerSide");
    }
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Kgool!!!...");
});
