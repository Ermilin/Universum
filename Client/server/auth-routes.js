const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/login",
  passport.authenticate("curity", {
    scope: "openid profile",
  }),
  (req, res) => res.redirect("/")
);

router.get("/callback", (req, res, next) => {
  passport.authenticate("curity", (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login");
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  })(req, res, next);
});

module.exports = router;
