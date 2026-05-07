const cache = {};

function setCache(key, data, ttl = 600000) { // 10 minutos
  cache[key] = {
    data,
    expira: Date.now() + ttl
  };
}

function getCache(key) {
  const item = cache[key];

  if (!item) return null;

  if (Date.now() > item.expira) {
    delete cache[key];
    return null;
  }

  return item.data;
}

module.exports = { setCache, getCache };