const router = require('express').Router();
const sequelize = require('../config/config')
const { Post, Comment, User } = require("../models/");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    // store the results of the db query in a variable called postData. should use something that "finds all" from the Post model. may need a where clause!
    const postData = await Post.findAll({
      where: { id: req.session.user_id },
      attributes: ["id", "post_url", "title", "created_at"],
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "created_at",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    // this sanitizes the data we just got from the db above (you have to create the above)
    const posts = postData.map((post) => post.get({ plain: true }));

    // fill in the view to be rendered
    res.render("all-posts-admin", {
      // this is how we specify a different layout other than main! no change needed
      layout: "dashboard",
      // coming from line 10 above, no change needed
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.redirect("login");
  } 
});

router.get("/new", withAuth, (req, res) => {
  // what view should we send the client when they want to create a new-post? (change this next line)
  res.render("new-post", {
    // again, rendering with a different layout than main! no change needed
    layout: "dashboard",
  });
});

router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    // what should we pass here? we need to get some data passed via the request body
    const postData = await Post.findByPk(req.param.id);

    if (postData) {
      // serializing the data
      const post = postData.get({ plain: true });
      // which view should we render if we want to edit a post?
      res.render("edit-post", {
        layout: "dashboard",
        post,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect("login");
  }
});

module.exports = router;
