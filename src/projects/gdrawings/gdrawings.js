const handleRequest = async (req, res) => {
  if (!req.params.id || !req.query.w || !req.query.h) {
    res.sendStatus(400);
    return;
  }
  const safeId = encodeURIComponent(req.params.id);
  const safeW = encodeURIComponent(req.query.w);
  const safeH = encodeURIComponent(req.query.h);
  const url = `https://docs.google.com/drawings/d/e/${safeId}/pub?w=${safeW}&h=${safeH}`;
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': req.headers['user-agent'],
      },
    });

    if (response.ok && response.headers.get('content-type') == 'image/png') {
      const data = await response.bytes();
      res.set('content-type', 'image/png').send(data);
    } else {
      res.sendStatus(500);
      return;
    }
  } catch (error) {
    console.error('[GDrawings] Request Error', error);
    res.sendStatus(502);
    return;
  }
};

export default handleRequest;
