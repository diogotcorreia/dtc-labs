const removeUnwantedEvents = (calendar) =>
  calendar.replace(
    /BEGIN:VEVENT[\s\S]{0,175}SUMMARY:(?:Inicio|Fim)(?!exame|inscrições|teste|Teste|projeto|trabalho|provas)[\s\S]*?END:VEVENT/gi,
    ''
  );

const handleRequest = async (req, res) => {
  const url = req.originalUrl.replace('/istcalrewrite/', '');
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': req.headers['user-agent'],
      },
    });
    const contentType = response.headers.get('content-type');
    if (response.ok && contentType?.startsWith('text/calendar')) {
      const ical = await response.text();
      res.set('content-type', contentType).send(removeUnwantedEvents(ical));
    } else {
      res.sendStatus(500);
      return;
    }
  } catch (error) {
    console.error('[IstCalRewrite] Request error:', error);
    res.sendStatus(502);
    return;
  }
};

export default handleRequest;
