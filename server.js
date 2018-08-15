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
                        req.session.steuernummer = req.body.steuernummer;
                        db
                            .createProducer(
                                results.id,
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
                console.log("problem benutzername");
            } else {
                userInfo = results[0];
                const hashedPwd = userInfo.hashed_password; //result is an array and hashed password is the fifth element of this array
                console.log(hashedPwd);
                bcrypt
                    .checkPassword(req.body.password, hashedPwd)
                    .then(checked => {
                        if (checked) {
                            console.log(checked);
                            req.session.userId = userInfo.id;
                            req.session.firstname = userInfo.firstname;
                            req.session.lastname = userInfo.lastname;
                            req.session.email = userInfo.email;
                            req.session.benutzername = userInfo.benutzername;
                            req.session.hashedPassword = hashedPwd;
                            req.session.loggedIn = true;
                            res.redirect("/profileCustomer");
                            console.log("passwordcheckedok");
                        } else {
                            res.redirect("/login");
                            console.log("password not ok");
                        }
                    });
            }
        });
    }
});

app.get("/loginProducer", (req, res) => {
    //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.render("loginProducer");
    } else {
        res.render("loginProducer");
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
                            req.session.steuernummer = userInfo.steuernummer;
                            req.session.loggedIn = true;
                            res.redirect("/profileProducer");
                        } else {
                            res.redirect("/loginProducer");
                        }
                    });
            }
        });
    }
});

app.get("/editProfileCustomer", (req, res) => {
    db.getUserInfo(req.session.userId).then(results => {
        //we put here all the data of the users in our different fields (because placeholder is not a solution) and we do that before the render
        req.session.firstname = results.firstname;
        req.session.lastname = results.lastname;
        req.session.email = results.email;
        req.session.benutzername = results.benutzername;
        req.session.hashedPassword = results.hashed_password;
        res.render("editProfileCustomer", {
            userData: results
        });
    });
});

app.post("/editProfileCustomer", (req, res) => {
    if (
        //these names have to be the same as the names in our edit handlebars
        req.body.firstname == "" &&
        req.body.lastname == "" &&
        req.body.email == "" &&
        req.body.benutzername == "" &&
        req.body.password == ""
    ) {
        console.log("no customer data changed", req.body);
        res.redirect("/profileCustomer");
    } else {
        if (req.body.firstname != "") {
            req.session.firstname = req.body.firstname;
        }
        if (req.body.lastname != "") {
            req.session.lastname = req.body.lastname;
        }
        if (req.body.email != "") {
            req.session.email = req.body.email;
        }
        if (req.body.benutzername != "") {
            req.session.benutzername = req.body.benutzername;
        }
        if (req.body.password != "") {
            //we hash the new password of the user: the variable result represents here the hashed password
            bcrypt
                .hashPassword(req.body.password)
                .then(result => {
                    //... and we add this hashed pwd to the result!
                    req.session.hashedPassword = result;
                    //problem: the function hashPassword is asynchronous. so we insert a then here:
                })
                .then(() => {
                    db
                        .updateUsers(
                            req.session.userId,
                            req.session.firstname,
                            req.session.lastname,
                            req.session.email,
                            req.session.benutzername,
                            req.session.hashedPassword
                        )
                        //we insert here a then because we write two functions for two different tables.
                        .then(() => {
                            res.redirect("/profileCustomer");
                            console.log("password was changed");
                        });
                });
        } else {
            //we create a else because in case the user did not change the password, we do not have any problem of asynchronousity and do not need any fucking then!
            db
                .updateUsers(
                    req.session.userId,
                    req.session.firstname,
                    req.session.lastname,
                    req.session.email,
                    req.session.benutzername,
                    req.session.hashedPassword
                )
                .then(() => {
                    //we wil redirect the user to the edit page so that he can see his new data
                    res.redirect("/profileCustomer");
                    console.log("password was not changed");
                });
        }
    }
});
//ACHTUNG: WHAT HAPPENS IF USER IS NOT LOGGED IN?
app.get("/profileCustomer", (req, res) => {
    db.getUserInfo(req.session.userId).then(results => {
        //we put here all the data of the users in our different fields (because placeholder is not a solution) and we do that before the render
        req.session.firstname = results.first_name;
        req.session.lastname = results.last_name;
        req.session.email = results.email;
        req.session.benutzername = results.benutzername;
        req.session.hashedPassword = results.hashed_password;
        res.render("profileCustomer", {
            userData: results
        });
    });
});

//ACHTUNG: WHAT HAPPENS IF USER IS NOT LOGGED IN?
app.get("/profileProducer", (req, res) => {
    db.getProducerInfo(req.session.userId).then(results => {
        req.session.firstname = results.first_name;
        req.session.lastname = results.last_name;
        req.session.email = results.email;
        req.session.benutzername = results.benutzername;
        req.session.hashedPassword = results.hashed_password;
        req.session.benutzername = results.benutzername;
        req.session.steuernummer = results.steuernummer;
        res.render("profileProducer", {
            userData: results
        });
    });
});

app.get("/presentationProducerSideRender", (req, res) => {
    db.getProducerPresentation(req.session.userId).then(results => {
        req.session.firmenname = results.firmenname;
        req.session.steuernummer = results.steuernummer;
        req.session.logo = results.logo;
        req.session.strasse = results.strasse;
        req.session.plz = results.plz;
        req.session.stadt = results.stadt;
        req.session.bundesland = results.bundesland;
        req.session.land = results.land;
        req.session.telefon = results.telefon;
        req.session.fax = results.fax;
        req.session.webseite = results.webseite;
        req.session.uberuns = results.uberuns;
        req.session.katalog = results.katalog;
        db.getProducerKeywords(req.session.userId).then(() => {
            req.session.keyword1 = results.keyword1;
            req.session.keyword2 = results.keyword2;
            req.session.keyword3 = results.keyword3;
            req.session.keyword4 = results.keyword4;
            req.session.keyword5 = results.keyword5;
            console.log("this is my session", req.session);
            res.render("presentationProducerSideRender", {
                userData: results
            });
        });

        console.log(results);
    });
});

app.get("/editProfileProducer", (req, res) => {
    db.getProducerInfo(req.session.userId).then(results => {
        req.session.firstname = results.first_name;
        req.session.lastname = results.last_name;
        req.session.email = results.email;
        req.session.benutzername = results.benutzername;
        req.session.hashedPassword = results.hashed_password;
        req.session.benutzername = results.benutzername;
        req.session.steuernummer = results.steuernummer;
        res.render("editProfileProducer", {
            userData: results
        });
    });
});

app.post("/editProfileProducer", (req, res) => {
    if (
        //these names have to be the same as the names in our edit handlebars
        req.body.firstname == "" &&
        req.body.lastname == "" &&
        req.body.email == "" &&
        req.body.password == "" &&
        req.body.benutzername == "" &&
        req.body.firmenname == "" &&
        req.body.steuernummer == ""
    ) {
        res.redirect("/profileProducer");
    } else {
        if (!req.body.firstname == "") {
            req.session.firstname = req.body.firstname;
        }
        if (!req.body.lastname == "") {
            req.session.lastname = req.body.lastname;
        }
        if (!req.body.email == "") {
            req.session.email = req.body.email;
        }
        if (!req.body.benutzername == "") {
            req.session.benutzername = req.body.benutzername;
        }
        if (!req.body.firmenname == "") {
            req.session.firmenname = req.body.firmenname;
        }
        if (!req.body.steuernummer == "") {
            req.session.steuernummer = req.body.steuernummer;
        }
        if (!req.body.password == "") {
            //we hash the new password of the user: the variable result represents here the hashed password
            bcrypt
                .hashPassword(req.body.password)
                .then(result => {
                    //... and we add this hashed pwd to the result!
                    req.session.hashedPassword = result;
                    //problem: the function hashPassword is asynchronous. so we insert a then here:
                })
                .then(() => {
                    db
                        .updateUsers(
                            req.session.userId,
                            req.session.firstname,
                            req.session.lastname,
                            req.session.email,
                            req.session.benutzername,
                            req.session.hashedPassword
                        )

                        //we insert here a then because we write two functions for two different tables.
                        .then(() => {
                            db
                                .updateProducerProfile(
                                    req.session.userId,
                                    req.session.firmenname,
                                    req.session.steuernummer
                                )

                                .then(() => {
                                    res.redirect("/profileProducer");
                                });
                        });
                });
        } else {
            //we create a else because in case the user did not change the password, we do not have any problem of asynchronousity and do not need any fucking then!
            db
                .updateUsers(
                    req.session.userId,
                    req.session.firstname,
                    req.session.lastname,
                    req.session.email,
                    req.session.benutzername,
                    req.session.hashedPassword
                )
                .then(() => {
                    db
                        .updateProducerProfile(
                            req.session.userId,
                            req.session.firmenname,
                            req.session.steuernummer
                        )
                        .then(() => {
                            //we wil redirect the user to the edit page so that he can see his new data
                            res.redirect("/profileProducer");
                        });
                });
        }
    }
});

app.post("/presentationProducerSide", (req, res) => {
    if (
        //these names have to be the same as the names in our edit handlebars
        req.body.firmenname == "" &&
        req.body.steuernummer == "" &&
        req.body.strasse == "" &&
        req.body.plz == "" &&
        req.body.stadt == "" &&
        req.body.bundesland == "" &&
        req.body.land == "" &&
        req.body.telefon == "" &&
        req.body.fax == "" &&
        req.body.uberuns == "" &&
        req.body.katalog == "" &&
        req.body.keyword1 == "" &&
        req.body.keyword2 == "" &&
        req.body.keyword3 == "" &&
        req.body.keyword4 == "" &&
        req.body.keyword5 == ""
    ) {
        res.redirect("/profileProducer");
    } else {
        if (req.body.firmenname != "") {
            req.session.firmenname = req.body.firmenname;
        }
        if (req.body.steuernummer != "") {
            req.session.steuernummer = req.body.steuernummer;
        }
        if (req.body.strasse != "") {
            req.session.strasse = req.body.strasse;
        }
        if (req.body.plz != "") {
            req.session.plz = req.body.plz;
        }
        if (req.body.stadt != "") {
            req.session.stadt = req.body.stadt;
        }
        if (req.body.bundesland != "") {
            req.session.bundesland = req.body.bundesland;
        }
        if (req.body.land != "") {
            req.session.land = req.body.land;
        }
        if (req.body.telefon != "") {
            req.session.telefon = req.body.telefon;
        }
        if (req.body.fax != "") {
            req.session.fax = req.body.fax;
        }
        if (req.body.webseite != "") {
            req.session.webseite = req.body.webseite;
        }
        if (req.body.uberuns != "") {
            req.session.uberuns = req.body.uberuns;
        }
        if (req.body.katalog != "") {
            req.session.katalog = req.body.katalog;
        }
        if (req.body.keyword1 != "") {
            req.session.keyword1 = req.body.keyword1;
        }
        if (req.body.keyword2 != "") {
            req.session.keyword2 = req.body.keyword2;
        }
        if (req.body.keyword3 != "") {
            req.session.keyword3 = req.body.keyword3;
        }
        if (req.body.keyword4 != "") {
            req.session.keyword4 = req.body.keyword4;
        }
        if (req.body.keyword5 != "") {
            req.session.keyword5 = req.body.keyword5;
        }
        db
            .createProducerPresentation(
                req.session.userId,
                req.session.firmenname,
                req.session.steuernummer,
                req.session.logo,
                req.session.strasse,
                req.session.nummer,
                req.session.plz,
                req.session.stadt,
                req.session.bundesland,
                req.session.land,
                req.session.telefon,
                req.session.fax,
                req.session.webseite,
                req.session.uberuns,
                req.session.katalog
            )
            .then(() => {
                db
                    .createProducerKeywords(
                        req.session.userId,
                        req.session.keyword1,
                        req.session.keyword2,
                        req.session.keyword3,
                        req.session.keyword4,
                        req.session.keyword5
                    )
                    .then(results => {
                        res.redirect("/presentationProducerSideRender");
                    });
            });
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
    db.getProducerPresentation(req.session.userId).then(results => {
        req.session.firmenname = results.firmenname;
        req.session.steuernummer = results.steuernummer;
        req.session.logo = results.logo;
        req.session.strasse = results.strasse;
        req.session.plz = results.plz;
        req.session.stadt = results.stadt;
        req.session.bundesland = results.bundesland;
        req.session.land = results.land;
        req.session.telefon = results.telefon;
        req.session.fax = results.fax;
        req.session.webseite = results.webseite;
        req.session.uberuns = results.uberuns;
        req.session.katalog = results.katalog;
        db.getProducerKeywords(req.session.userId).then(results2 => {
            req.session.keyword1 = results2.keyword1;
            req.session.keyword2 = results2.keyword2;
            req.session.keyword3 = results2.keyword3;
            req.session.keyword4 = results2.keyword4;
            req.session.keyword5 = results2.keyword5;
            console.log("this is my second session", req.session);
            res.render("presentationProducerSide", {
                userData: results,
                keywords: results2
            });
        });
        console.log("this is my first session", req.session);
    });
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
