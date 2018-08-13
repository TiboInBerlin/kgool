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

app.get("/registerCustomer", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("registerCustomer");
    } else {
        res.render("registerCustomer");
    }
});

app.post("/registerCustomer", (req, res) => {
    //we will use the body parser to get the values of the form of the body
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.email == "" ||
        req.body.benutzername == "" ||
        req.body.password == ""
    ) {
        res.redirect("/"); // if the user has one empty field, we redirect user to register page
    } else {
        //first we have to do is hashing the password of the user
        //we access the hashPassword function from bscrypt file and we use .then since the function was promisified in bsrypt.js
        bcrypt
            .hashPassword(req.body.password)
            .then(hashedPassword => {
                // we create here the hashedpassword value in order to receive the returned value of the function hashPassword
                db
                    .createUser(
                        req.body.firstname,
                        req.body.lastname,
                        req.body.email,
                        req.body.benutzername,
                        hashedPassword
                    )
                    .then(results => {
                        //before sending the user to homepage, we want to create a session in order to encrypt the user's data because these data will be available on the client side, which is not safe.
                        req.session.userId = results.id;
                        req.session.firstname = req.body.firstname;
                        req.session.lastname = req.body.lastname;
                        req.session.email = req.body.email;
                        req.session.benutzername = req.body.benutzername;
                        req.session.hashedPassword = hashedPassword;
                        req.session.loggedIn = true;

                        res.redirect("/profileCustomer");
                    });
            })
            .catch(err => {
                console.log(err);
            });
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

app.post("/registerProducer", (req, res) => {
    //we will use the body parser to get the values of the form of the body
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.email == "" ||
        req.body.benutzername == "" ||
        req.body.password == ""
    ) {
        res.redirect("/"); // if the user has one empty field, we redirect user to register page
    } else {
        //first we have to do is hashing the password of the user
        //we access the hashPassword function from bscrypt file and we use .then since the function was promisified in bsrypt.js
        bcrypt
            .hashPassword(req.body.password)
            .then(hashedPassword => {
                // we create here the hashedpassword value in order to receive the returned value of the function hashPassword
                db
                    .createUser(
                        req.body.firstname,
                        req.body.lastname,
                        req.body.email,
                        req.body.benutzername,
                        hashedPassword
                    )
                    .then(results => {
                        //before sending the user to homepage, we want to create a session in order to encrypt the user's data because these data will be available on the client side, which is not safe.
                        req.session.userId = results.id;
                        /*req.session.firstname = req.body.firstname;
                        req.session.lastname = req.body.lastname;
                        req.session.email = req.body.email;
                        req.session.benutzername = req.body.benutzername;
                        req.session.hashedPassword = hashedPassword;
                        req.session.loggedIn = true;*/
                        req.session.firmenname = req.body.firmenname;
                        req.session.steuername = req.body.steuernummer;
                        db
                            .createProducer(
                                req.body.firmenname,
                                req.body.steuernummer
                            )
                            .then(results => {
                                req.session.firstname = req.body.firstname;
                                req.session.lastname = req.body.lastname;
                                req.session.email = req.body.email;
                                req.session.benutzername =
                                    req.body.benutzername;
                                req.session.hashedPassword = hashedPassword;
                                req.session.loggedIn = true;
                                req.session.firmenname = req.body.firmenname;
                                req.session.steuernummer =
                                    req.body.steuernummer;
                                res.redirect("/profileProducer");
                            });
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/login", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("login");
    } else {
        res.render("login");
    }
});

app.post("/login", (req, res) => {
    var userInfo; //We create this variable in order to link it with the variable results in our getEmail function.
    //we will use the body parser to get the values of the form of the body
    if (req.body.benutzername == "" || req.body.password == "") {
        //req.session.loggedIn = false;
        res.redirect("/login"); // if the user has one empty field, we redirect user to register page
    } else {
        db.getBenutzername(req.body.benutzername).then(results => {
            //remember: the result is ALWAYS an array!
            if (results.length == 0) {
                res.redirect("/login");
            } else {
                userInfo = results[0];
                const hashedPwd = userInfo.hashed_password; //result is an array and hashed password is the fifth element of this array
                bcrypt
                    .checkPassword(req.body.password, hashedPwd)
                    .then(checked => {
                        if (checked) {
                            console.log(checked);
                            req.session.userId = userInfo.id;
                            req.session.firstname = userInfo.first_name;
                            req.session.lastname = userInfo.last_name;
                            req.session.email = userInfo.email;
                            req.session.benutzername = userInfo.benutzername;
                            req.session.hashedPassword = hashedPwd;
                            req.session.loggedIn = true;
                            res.redirect("/profileCustomer")
                        } else {
                            res.redirect("/login");
                        }
                    });
            }
        });
    }
});

app.get("/loginProducer", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("login");
    } else {
        res.render("login");
    }
});

app.post("/loginProducer", (req, res) => {
    var userInfo; //We create this variable in order to link it with the variable results in our getEmail function.
    //we will use the body parser to get the values of the form of the body
    if (req.body.benutzername == "" || req.body.password == "") {
        //req.session.loggedIn = false;
        res.redirect("/loginProducer"); // if the user has one empty field, we redirect user to register page
    } else {
        db.getBenutzername(req.body.benutzername).then(results => {
            //remember: the result is ALWAYS an array!
            if (results.length == 0) {
                res.redirect("/loginProducer");
            } else {
                userInfo = results[0];
                const hashedPwd = userInfo.hashed_password; //result is an array and hashed password is the fifth element of this array
                bcrypt
                    .checkPassword(req.body.password, hashedPwd)
                    .then(checked => {
                        if (checked) {
                            console.log(checked);
                            req.session.userId = userInfo.id;
                            req.session.firstname = userInfo.first_name;
                            req.session.lastname = userInfo.last_name;
                            req.session.email = userInfo.email;
                            req.session.benutzername = userInfo.benutzername;
                            req.session.hashedPassword = hashedPwd;
                            req.session.firmenname = userInfo.firmenname;
                            req.session.steuernummer = userInfo.steuernummer
                            req.session.loggedIn = true;
                            res.redirect("/profileProducer")
                        } else {
                            res.redirect("/loginProducer");
                        }
                    });
            }
        });
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
