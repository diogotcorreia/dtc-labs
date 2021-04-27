import request from 'request';

const removeUnwantedEvents = (calendar) =>
  calendar.replace(
    /BEGIN:VEVENT[\s\S]{0,175}SUMMARY:(?:Inicio|Fim)(?!exame|inscrições|teste|Teste|projeto|trabalho|provas)[\s\S]*?END:VEVENT/gi,
    ''
  );

const handleRequest = (req, res) => {
  var options = {
    url: req.originalUrl.replace('/istcalrewrite/', ''),
    headers: {
      'User-Agent': req.headers['user-agent'],
    },
    encoding: null,
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res
        .set('Content-Type', 'text/calendar')
        .send(Buffer.from(removeUnwantedEvents(body.toString('utf-8'))));
    } else {
      console.error('[IstCalRewrite] Request error: ' + JSON.stringify(error));
      res.sendStatus(500);
    }
  });
};

export default handleRequest;
