import request from 'request';

const handleRequest = (req, res) => {
  var options = {
    url:
      'https://docs.google.com/drawings/d/e/' +
      req.params.id +
      '/pub?w=' +
      req.query.w +
      '&h=' +
      req.query.h,
    headers: {
      'User-Agent': req.headers['user-agent'],
    },
    encoding: null,
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'image/png').send(body);
    } else {
      console.error('[GDrawings] Request error: ' + JSON.stringify(error));
      res.sendStatus(500);
    }
  });
};

export default handleRequest;
