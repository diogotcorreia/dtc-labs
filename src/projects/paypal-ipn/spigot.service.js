export const getUserById = async (id) => {
  const res = await fetch(
    `https://api.spigotmc.org/simple/0.2/index.php?action=getAuthor&id=${encodeURIComponent(id)}`
  );
  if (!res.ok) throw new Error('spigot api status not 2xx');
  return await res.json();
};
