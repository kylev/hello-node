var AWS = require('aws-sdk'),
  async = require('async'),
  redis = require('redis');

// TODO This feels wrong.
var rdb = redis.createClient();

exports.featured = function (req, res) {

  rdb.lrange("featured_stories", 0, 10, function (err, story_ids) {
    // TODO Should handle redis errors
    async.map(story_ids, findStory, function (err, story_list) {
      res.render('story/featured', {story_list: story_list});
    });
  });
};

exports.show = function (req, res) {
  res.setHeader('Content-Type', 'text/plain');

  var key_desc = {id: {S: req.params.id}};

  var ddb = new AWS.DynamoDB();
  ddb.getItem({TableName: "Story", Key: key_desc}, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
    res.end();
  });

};

function findStory(story_id, cb) {
  var key_desc = {id: {S: story_id}};
  var ddb = new AWS.DynamoDB();

  ddb.getItem({TableName: "Story", Key: key_desc}, function (err, data) {
    var transformed = {};
    var contents = data.Item;

    for (var key in contents) {
      transformed[key] = contents[key].S;
    }

    cb(err, transformed);
  });
}
