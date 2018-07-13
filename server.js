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

app.post("/home", (req, res) => {
    //console.log(req.body.hidden);
    //console.log(hiddenInput.value);
    //if you log req body and it is undefined, this means bodyPArser was not required!
    if (
        //req.body.firstname == "" ||
        //req.body.lastname == "" ||
        req.body.hidden == ""
    ) {
        res.redirect("/home");
    } else {
        db
            .insertSignature(
                req.session.userId,
                //req.session.firstname,
                //req.session.lastname,
                req.body.hidden
            )
            //what did we do on line above? we are taking the data from the session that we created in this page in post/register
            .then(signature => {
                //res.json(newUser);
                req.session.signed = true;
                //console.log(newUser);
                res.redirect("/signed");
            });
    }
});

app.get("/signed", (req, res) => {
    if (req.session.loggedIn != true) {
        res.redirect("/login");
    } else {
        db.getSignature(req.session.userId).then(sign => { //we use here the userID because we always have it!
console.log(req.session.userId);
            console.log(sign); //we use sign[0] because the function getSignature will return an array (seed.js). we indeed want it to return an array and not an objectbecause it is easy to state if an array is zero or not while it is not so easy with an object.
            res.render("signed", {
                signature: sign[0].signature
            });
        });
    }
    //res.json(sign);
    //res.render("signed");
});

app.get("/signers", (req, res) => {
    if (req.session.loggedIn != true) {
        res.redirect("/login");
    } else {
        db.returnUsers().then(allUsers => {
            res.render("signers", {
                layout: "main",
                content: allUsers,
                length: allUsers.length
            });
        });
    }
});

app.get("/", (req, res) => {
    req.session.loggedIn != true;
    res.render("register"); // when the user type "/register", user will be redirected to the register view
});

app.post("/", (req, res) => {
    //we will use the body parser to get the values of the form of the body
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.email == "" ||
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
                        hashedPassword
                    )
                    .then(results => {
                        //before sending the user to homepage, we want to create a session in order to encrypt the user's data because these data will be available on the client side, which is not safe.
                        req.session.userId = results.id;
                        req.session.firstname = req.body.firstname;
                        req.session.lastname = req.body.lastname;
                        req.session.email = req.body.email;
                        req.session.hashedPassword = hashedPassword;
                        req.session.loggedIn = true;

                        res.redirect("/profile");
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/login", (req, res) => { //in the get, i ahve always to use a page! that s why: /login
    if (req.session.loggedIn != true) {
        res.redirect("/login");
    } else {
        res.render("login");
    }
});

app.post("/login", (req, res) => {
    var userInfo; //We create this variable in order to link it with the variable results in our getEmail function.
    //we will use the body parser to get the values of the form of the body
    if (req.body.email == "" || req.body.password == "") {
        //req.session.loggedIn = false;
        res.redirect("/login"); // if the user has one empty field, we redirect user to register page
    } else {
        db.getEmail(req.body.email).then(results => {
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
                            req.session.hashedPassword = hashedPwd;
                            req.session.loggedIn = true;
                            db.getSignature(req.session.userId).then((results)=>{
                                console.log(results);
                            if (results.length == 0) {
                                req.session.signed = false; // I make his inout in order not to connect always with my database
                                res.redirect("/home");
                            }else{
                            req.session.signed = true;
                            res.redirect("/signed");
                            }

                            });

                        } else {
                            res.redirect("/login");
                        }
                    });
            }
        });
    }
});

app.get("/profile", (req, res) => {
    if (req.session.loggedIn = true) {
        //We write this in order to check that the user is well logged in! we did that for all pages!
        res.render("profile");
    } else {
        res.redirect("/login");
    }
});

app.post("/profile", (req, res) => {
    if (req.body.age == "" && req.body.city == "" && req.body.url == "") {
        res.redirect("/home"); // if the user has one empty field, we redirect user to register page
    } else {
        //we will have to add here all the new information that the users gave.
        db
            .insertProfile(
                req.session.userId,
                req.body.age,
                req.body.city,
                req.body.url
            )
            .then(() => {
                res.redirect("/home");
            });
    }
});

app.get("/signers/:cityName", (req, res) => {
    //we use : in order to make a dynamic link so that we store each different city in a different page.
    var cityName = req.params.cityName; //I use this to make a query to database
    db.getSignersByCityName(cityName).then(citySigners => {
        res.render("city", {
            content: citySigners
        });
    });
});

app.get("/profile/edit", (req, res) => {
    db.getUserInfo(req.session.userId).then(results => {
        //we put here all the data of the users in our different fields (because placeholder is not a solution) and we do that before the render
        req.session.firstname = results.first_name;
        req.session.lastname = results.last_name;
        req.session.email = results.email;
        req.session.hashedPassword = results.hashed_password;
        req.session.age = results.age;
        req.session.city = results.city;
        req.session.url = results.url;
        res.render("edit", {
            userData: results
        });
    });
});

app.post("/profile/edit", (req, res) => {
    if (
        //these names have to be the same as the names in our edit handlebars
        req.body.firstname == "" &&
        req.body.lastname == "" &&
        req.body.email == "" &&
        req.body.password == "" &&
        req.body.age == "" &&
        req.body.city == "" &&
        req.body.url == ""
    ) {
        res.redirect("/signed");
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
        if (!req.body.age == "") {
            req.session.age = req.body.age;
        }
        if (!req.body.city == "") {
            req.session.city = req.body.city;
        }
        if (!req.body.url == "") {
            req.session.url = req.body.url;
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
                            req.session.hashedPassword
                        )
                        //we insert here a then because we write two functions for two different tables.
                        .then(() => {
                            db
                                .updateUserProfile(
                                    req.session.userId,
                                    req.session.age,
                                    req.session.city,
                                    req.session.url
                                )
                                .then(() => {
                                    //we wil redirect the user to the edit page so that he can see his new data
                                    res.redirect("/profile/edit");
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
                    req.session.hashedPassword
                )
                .then(() => {
                    db
                        .updateUserProfile(
                            req.session.userId,
                            req.session.age,
                            req.session.city,
                            req.session.url
                        )
                        .then(() => {
                            //we wil redirect the user to the edit page so that he can see his new data
                            res.redirect("/profile/edit");
                        });
                });
        }
    }
});

app.get('/deleteSignature',(req,res)=>{
    db.deleteSignature(req.session.userId).then(()=>{
        req.session.signed = false;
        res.redirect('/home');
    })
})

app.listen(process.env.PORT || 8080, () => {
    console.log("listening to petition...");
});
