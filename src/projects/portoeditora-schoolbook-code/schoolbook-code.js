import axios from 'axios';

const handleRequest = async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json');
  try {
    const { data } = await axios.get(`https://${req.params[0]}`);
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
  }
};

export default handleRequest;
