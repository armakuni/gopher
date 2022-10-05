/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const fetch = require("node-fetch");

let cache = null;
let cacheExpiration = null;
const authHeader = `Bearer ${process.env.APIa_TOKEN}`;

async function ensureCache() {

  if(cacheExpiration && cacheExpiration < Date.now()) {
    console.log("Cache invalidated");
    cache = null;      
  }

  if(!cache) {
    const resp = await fetch("https://slack.com/api/users.list?limit=999", {
      headers: {
        "Authorization": authHeader
      }
    });
    const data = await resp.json();
    if (!data.ok) {

      throw new Error(JSON.stringify(data));
      
    }
    cache = data
      ?.members
      ?.filter(m => !(m.deleted || m.is_bot || m.is_app))
      ?.map(({ name, real_name }) => ({ name, real_name }));
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 5);
    cacheExpiration = expiration.valueOf();
  }

}

exports.getUser = async (_req, res) => {

  try {

    await ensureCache();
    const chosen = cache[Math.floor(Math.random() * cache.length)];
    res.status(200).send({
      "response_type": "in_channel",
      "text": `${chosen.real_name}: <@${chosen.name}>`
    });

  } catch(err) {

    console.error(err);
    res.status(500).send(err.message);

  }

};

