import axios from 'axios';

const handleRequest = async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json');
  try {
    console.log(req.params[0]);
    const { data } = await axios.get(req.params[0]);
    res.end(
      JSON.stringify({
        code:
          data.match(
            /<span class="text-label">Código:<\/span>[\s\n]*<span class="text-value">(\d{4,5})<\/span>/
          )?.[1] || '',
      })
    );
  } catch (e) {
    res.end(JSON.stringify({ code: '' }));
    console.error(e);
  }
};

export default handleRequest;
