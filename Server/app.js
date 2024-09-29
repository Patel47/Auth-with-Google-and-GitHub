const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
require("./config/passport"); // Import Passport config

dotenv.config();

const app = express();

// Middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("profile", { user: req.user });
  } else {
    res.redirect("/");
  }
});

// GitHub Auth
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// Google Auth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// Logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
