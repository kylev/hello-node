var AWS = require('aws-sdk');

exports.index = function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end("Blah!");
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
