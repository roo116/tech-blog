const sequelize = require("../config/config");
const router = require("express").Router();
const { Post, Comment, User } = require("../models/");

// get all posts for homepage
router.get("/", async (req, res) => {
  try {
    // we need to get all Posts and include the User for each (change lines 8 and 9)
    const postData = await Post.findAll({
      attributes: ["id", "post_url", "title", "created_at"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    // serialize the data
    const posts = postData.map((post) => post.get({ plain: true }));
    // we should render all the posts here
    res.render("all-posts", { posts });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get single post
// router.get("/post/:id", async (req, res) => {
//   console.log('>>>> in getSinglePost homeroutes')
//   console.log(`>>>> req = ${req} and res = ${res}`)
//   try {
//     // what should we pass here? we need to get some data passed via the request body (something.something.id?)
//     // change the model below, but not the findByPk method.
//     const postData = await Post.findByPk(req.param.id, {
//       // helping you out with the include here, no changes necessary
//       include: [
//         User,
//         {
//           model: Comment,
//           include: [User],
//         },
//       ],
//     });
//     console.log('>>> this is postData >>>', postData)

//     if (postData) {
//       // serialize the data
//       const post = postData.get({ plain: true });
//       // which view should we render for a single-post?
//       res.render("single-post", { post });
//     } else {
//       res.status(404).end();
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get("/post/:id", (req, res) => {
  // const postData = {
  //   id: 1,
  //   post_url: "https://handlebarsjs.com/guide",
  //   title: "Handlebars Docs",
  //   createdAt: new Date(),
  //   vote_count: 10,
  //   comments: [{}, {}],
  //   user: {
  //     username: "test_user",
  //   },
  // };
  const postData = Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["post_url", "title", "createdAt"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
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
  })
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: "Post id not found" });
        return;
      }
      const post = postData.get({ plain: true });
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// giving you the login and signup route pieces below, no changes needed.
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

module.exports = router;
