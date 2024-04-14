const axios = require("axios");

async function getLivestream(client, streamername) {
  const token = await client.db.Token.findUnique({
    where: { token_name: "twitch_access_token" },
  });
  const tclient = await client.db.Token.findUnique({
    where: { token_name: "twitch_client_id" },
  });
  if (!tclient.token_value || !token.token_value) {
    await execRefresh(client);
    return null;
  }

  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/streams?user_login=${streamername}`.replace(
        "#",
        "",
      ),
      {
        headers: {
          Authorization: `Bearer ${token.token_value}`,
          "Client-ID": tclient.token_value,
        },
      },
    );
    if (response.status !== 200) {
      await execRefresh(client);
      return null;
    }

    return response.data.data[0];
  } catch (e) {
    await execRefresh(client);
    return null;
  }
}

// OAUTH
async function generateCode(clientId, scopes) {
  if (!clientId || !scopes) return `clientId or Scopes are Missing!`;
  return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=http://localhost&response_type=code&scope=${
    scopes
      ? scopes
      : "bits:read+channel:manage:redemptions+channel:read:hype_train+channel:read:redemptions+channel:read:subscriptions+moderator:read:chatters"
  }`;
}

async function generateRefreshToken(clientId, clientSecret, code) {
  const response = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost",
    },
  });
  return response.data;
}

async function refreshToken(client, clientId, clientSecret, refreshToken) {
  const response = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  });
  console.log(response.data);
  await client.db.Token.update({
    data: {
      token_value: response.data.access_token,
    },
    where: {
      token_name: "twitch_access_token",
    },
  });

  return response.data;
}

async function generateFromZeroAndTestRefresh(clientId, clientSecret, code) {
  const refreshTokenGenerateResponse = await generateRefreshToken(
    clientId,
    clientSecret,
    code,
  );
  const { access_token, expires_in, refresh_token, scope, token_type } =
    refreshTokenGenerateResponse;

  await refreshToken(clientId, clientSecret, refresh_token);
}

async function execRefresh(client) {
  const id = await client.db.Token.findUnique({
    where: {
      token_name: "twitch_client_id",
    },
  });
  const secret = await client.db.Token.findUnique({
    where: {
      token_name: "twitch_client_secret",
    },
  });
  const refresh = await client.db.Token.findUnique({
    where: {
      token_name: "twitch_refresh_token",
    },
  });
  await refreshToken(
    client,
    id.token_value,
    secret.token_value,
    refresh.token_value,
  );
  console.log("REFRESHED TOKEN!");
}

module.exports = {
  getLivestream,
  generateCode,
  generateRefreshToken,
  refreshToken,
  execRefresh,
};
