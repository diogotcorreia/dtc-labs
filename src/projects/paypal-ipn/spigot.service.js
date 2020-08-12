import axios from 'axios';

export const getUserById = async (id) => {
  const res = await axios.get(
    `https://api.spigotmc.org/simple/0.1/index.php?action=getAuthor&id=${encodeURIComponent(id)}`
  );
  if (res.status !== 200) throw new Error('spigot api status not 200');
  return res.data;
};
