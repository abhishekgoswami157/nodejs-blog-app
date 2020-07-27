var express = require('express');
var router = express.Router();

var Article = require('../models/Article');
var Comment = require('../models/Commnet');



//create
router.get('/new', function(req, res, next) {
  res.render("createArticle");
});

router.post("/", (req, res, next) =>{
  Article.create(req.body, (err, createArticle) => {
    if(err) return next(err);
    // console.log("Article created")
    res.redirect("/articles");
  })
})

//create comment
router.post("/:articleId/comments", (req, res, next) => {
  var articleId = req.params.articleId;
  req.body.articleId = articleId;
  Comment.create(req.body, (err, Comment) => {
    if(err) return next(err);
    res.redirect("/articles/" + articleId);
  })
})


//read
router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if(err) return next(err);
    res.render("listArticles", { articles });
  })
})


//read single user

router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    Comment.find({ articleId: id }, (err, comments) => {
      if(err) return next(err);
      res.render("singleArticle", { article, comments });

    })
  })
})



//update
router.get("/:id/edit", (req, res, next) => {
  let articleId = req.params.id;
  Article.findById(articleId, (err, article) => {
    if(err)return next(err);
    res.render("updateArticle", { article });
  })
})


router.post("/:id/edit", (req, res, next) => {
  let articleId = req.params.id;
  Article.findByIdAndUpdate(articleId, req.body, (err, updateArticle) => {
    if(err) return next(err);
    res.redirect("/articles");
  })
})

//update comment
router.get("/:articleId/:commentId/edit", (req, res, next) => {
  Article.findById(req.params.articleId, (err, article) => {
    Comment.findById(req.params.commentId, (err, comment) => {
      res.render("updateComment", { article, comment })
    })
  })
})

router.post("/:articleId/:commentId/edit", (req, res, next) => {
  Article.findById(req.params.articleId, (err, article) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body, (err) => {
      if(err) return next(err);
      res.redirect("/articles/" + req.params.articleId);
    })
  })
})

//Delete
router.get("/:id/delete", (req, res, next) => {
  Article.findByIdAndDelete(req.params.id, (err) => {
    if(err) return next(err);
    res.redirect("/articles");
  })
})

//delete comment
router.get("/:articleId/:commentId/delete", (req, res, next) => {
console.log("enter delete")
  Article.findById(req.params.articleId, (err, article)=> {
    if(err) return next(err);

    Comment.findByIdAndDelete(req.params.commentId, (err, comment) => {
      if(err) return next(err);
      res.redirect("/articles/" + req.params.articleId)
    })

  })
})

module.exports = router;
