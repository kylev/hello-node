var AWS = require('aws-sdk'),
  async = require('async'),
  redis = require('redis'),
  u = require('lodash');

// TODO This feels wrong.
var rdb = redis.createClient();

exports.featured = function (req, res, next) {

  rdb.lrange("featured_stories", 0, 10, function (err, story_ids) {
    // TODO Should handle redis errors
    async.map(story_ids, findStory, function (err, story_list) {
      if (err) {
        next(err);
        return;
      }

      res.render('story/featured', {story_list: u.compact(story_list)});
    });
  });
};

exports.show = function (req, res, next) {
  findStory(req.params.id, function (err, data) {
    if (err) {
      next(err);
      return;
    }

    if (data === null) {
      next();
      return;
    }

    res.render('story/show', {story: data});
  });
};

exports.newStory = function (req, res) {
  res.render('story/new');
};

exports.createStory = function (req, res, next) {
  next(new Error("Not Implemented"));
};

function findStory(story_id, cb) {
  var key_desc = {id: {S: story_id}};
  var ddb = new AWS.DynamoDB();

  ddb.getItem({TableName: "Story", Key: key_desc}, function (err, data) {
    if (err) {
      cb(err, null);
      return;
    }

    if (u.isEmpty(data)) {
      // Stale entry in the list, no related story
      cb(null, null);
    } else {
      var transformed = {};
      var contents = data.Item;

      for (var key in contents) {
        transformed[key] = contents[key].S;
      }

      cb(err, transformed);
    }
  });
}
