const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/.env" });
console.log("Riot API Key cargada:", process.env.RIOT_API_KEY ? "SI" : "NO");

const app = express();
const PORT = process.env.PORT || 3000;
function getRegionalRoute(region) {
    const routes = {
        NA: 'americas',
        LAN: 'americas',
        LAS: 'americas',
        BR: 'americas',
        EUW: 'europe',
        EUNE: 'europe',
        TR: 'europe',
        RU: 'europe',
        KR: 'asia',
        JP: 'asia',
        OCE: 'sea'
    };

    return routes[region?.toUpperCase()] || 'americas';
}
app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    message: "Backend de LOISCOPE funcionando"
  });
});
app.get("/api/account/:gameName/:tagLine", async (req, res) => {
  try {
    const { gameName, tagLine } = req.params;

    const url =
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/` +
      `${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        message: "Riot API rechazó la solicitud"
      });
    }

    const account = await response.json();

    res.json({
      ok: true,
      gameName: account.gameName,
      tagLine: account.tagLine,
      puuid: account.puuid
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error interno de RiotAnalytics"
    });
  }
});
app.get("/api/matches/:puuid", async (req, res) => {
  
  try {
    const { puuid } = req.params;

    const url =
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/` +
      `${encodeURIComponent(puuid)}/ids?start=0&count=20`;

    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        message: "Riot API rechazó la solicitud de partidas"
      });
    }

    const matches = await response.json();

    res.json({
      ok: true,
      matches: matches
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error interno al buscar partidas"
    });
  }
});

app.get("/api/match/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;

    const url =
      `https://americas.api.riotgames.com/lol/match/v5/matches/` +
      `${encodeURIComponent(matchId)}`;

    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        message: "Riot API rechazó la solicitud de la partida"
      });
    }

    const match = await response.json();

    res.json({
      ok: true,
      match: match
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error interno al buscar la partida"
    });
  }
});

app.get("/api/player-match/:matchId/:puuid", async (req, res) => {
  try {
    const { matchId, puuid } = req.params;

    const url =
      `https://americas.api.riotgames.com/lol/match/v5/matches/` +
      `${encodeURIComponent(matchId)}`;

    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        message: "Riot API rechazó la solicitud"
      });
    }

    const match = await response.json();

    const player = match.info.participants.find(
      participant => participant.puuid === puuid
    );

    if (!player) {
      return res.status(404).json({
        ok: false,
        message: "Jugador no encontrado en esta partida"
      });
    }

    res.json({
      ok: true,
      player: {
        gameName: player.riotIdGameName,
        tagLine: player.riotIdTagline,
        champion: player.championName,
        position: player.teamPosition,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        cs: player.totalMinionsKilled + player.neutralMinionsKilled,
        gold: player.goldEarned,
        damageToChampions: player.totalDamageDealtToChampions,
        visionScore: player.visionScore,
        win: player.win
      },
      game: {
        durationSeconds: match.info.gameDuration,
        queueId: match.info.queueId
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error interno al analizar la partida"
    });
  }
});

app.get("/api/analyze/:gameName/:tagLine", async (req, res) => {
  try {
    const { gameName, tagLine } = req.params;
const region = req.query.region || 'LAS';
const regionalRoute = getRegionalRoute(region);
const accountRoute = region.toUpperCase() === 'OCE' ? 'asia' : regionalRoute;
console.log('ANALYZE RECIBIDO:', gameName, tagLine, region, regionalRoute);    
// 1. Buscar la cuenta y obtener el PUUID
    const accountUrl =
      `https://${accountRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/` +      `${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

    const accountResponse = await fetch(accountUrl, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY
      }
    });

    console.log('ACCOUNT STATUS:', accountResponse.status, 'URL:', accountUrl);
    if (!accountResponse.ok) {
      return res.status(accountResponse.status).json({
        ok: false,
        status: accountResponse.status,
        message: "No se pudo obtener la cuenta"
      });
    }

    const account = await accountResponse.json();
    const puuid = account.puuid;

    // 2. Buscar la partida más reciente
    const matchesUrl =
      `https://${regionalRoute}.api.riotgames.com/lol/match/v5/matches/by-puuid/` +
      `${encodeURIComponent(puuid)}/ids?start=0&count=1`;

    const matchesResponse = await fetch(matchesUrl, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY
      }
    });

    if (!matchesResponse.ok) {
      return res.status(matchesResponse.status).json({
        ok: false,
        status: matchesResponse.status,
        message: "No se pudo obtener el historial de partidas"
      });
    }

    const matches = await matchesResponse.json();
console.log('REGION:', region, 'ROUTE:', regionalRoute, 'MATCHES URL:', matchesUrl, 'MATCHES:', matches);
    if (matches.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No se encontraron partidas"
      });
    }

    const matchId = matches[0];

    // 3. Obtener los datos completos de esa partida
    const matchUrl =
      `https://${regionalRoute}.api.riotgames.com/lol/match/v5/matches/` +
      `${encodeURIComponent(matchId)}`;

    const matchResponse = await fetch(matchUrl, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY
      }
    });

    if (!matchResponse.ok) {
      return res.status(matchResponse.status).json({
        ok: false,
        status: matchResponse.status,
        message: "No se pudo obtener la partida"
      });
    }

    const match = await matchResponse.json();

    // 4. Encontrar al jugador dentro de la partida
    const player = match.info.participants.find(
      participant => participant.puuid === puuid
    );

    if (!player) {
      return res.status(404).json({
        ok: false,
        message: "Jugador no encontrado en la partida"
      });
    }

    // 5. Devolver solamente los datos que nos interesan
    res.json({
      ok: true,
      account: {
        gameName: account.gameName,
        tagLine: account.tagLine
      },
      matchId: matchId,
      player: {
        champion: player.championName,
        position: player.teamPosition,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        cs: player.totalMinionsKilled + player.neutralMinionsKilled,
        gold: player.goldEarned,
        damageToChampions: player.totalDamageDealtToChampions,
        visionScore: player.visionScore,
        win: player.win
      },
      game: {
        durationSeconds: match.info.gameDuration,
        queueId: match.info.queueId
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error interno al analizar al jugador"
    });
  }
});

app.get("/api/analyze-history/:gameName/:tagLine", async (req, res) => {
  try {
    const { gameName, tagLine } = req.params;
const region = req.query.region || 'LAS';
const regionalRoute = getRegionalRoute(region);
const accountRoute = region.toUpperCase() === 'OCE' ? 'asia' : regionalRoute;
    // 1. Buscar la cuenta
    const accountUrl =
     `https://${accountRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/` +
      `${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

    const accountResponse = await fetch(accountUrl, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY
      }
    });

    if (!accountResponse.ok) {
      return res.status(accountResponse.status).json({
        ok: false,
        message: "No se pudo obtener la cuenta"
      });
    }

    const account = await accountResponse.json();
    const puuid = account.puuid;

    // 2. Buscar las últimas 5 partidas
    const matchesUrl =
    `https://${regionalRoute}.api.riotgames.com/lol/match/v5/matches/by-puuid/` +  
    `${encodeURIComponent(puuid)}/ids?queue=420&start=0&count=20`;
    const matchesResponse = await fetch(matchesUrl, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY
      }
    });

    if (!matchesResponse.ok) {
      return res.status(matchesResponse.status).json({
        ok: false,
        message: "No se pudo obtener el historial"
      });
    }

    const matchIds = await matchesResponse.json();
    const games = [];

    // 3. Abrir cada partida y encontrar al jugador
    for (const matchId of matchIds) {
      const matchUrl =
        `https://${regionalRoute}.api.riotgames.com/lol/match/v5/matches/` +
        `${encodeURIComponent(matchId)}`;

      const matchResponse = await fetch(matchUrl, {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY
        }
      });

      if (!matchResponse.ok) {
        continue;
      }

      const match = await matchResponse.json();

      const player = match.info.participants.find(
        participant => participant.puuid === puuid
      );

      if (!player) {
        continue;
      }
      
      const teamKills = match.info.participants
  .filter(participant => participant.teamId === player.teamId)
  .reduce((sum, participant) => sum + participant.kills, 0);
  const playerTeam = match.info.teams.find(
  team => team.teamId === player.teamId
);
const teamDragonKills = playerTeam?.objectives?.dragon?.kills || 0;
const teamBaronKills = playerTeam?.objectives?.baron?.kills || 0;
const teamRiftHeraldKills = playerTeam?.objectives?.riftHerald?.kills || 0;

games.push({
        matchId: matchId,
        champion: player.championName,
        position: player.teamPosition,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        teamKills: teamKills,
        cs: player.totalMinionsKilled + player.neutralMinionsKilled,
        gold: player.goldEarned,
        damageToChampions: player.totalDamageDealtToChampions,
        damageToTurrets: player.damageDealtToTurrets || 0,
        dragonTakedowns: player.challenges?.dragonTakedowns || 0,
baronTakedowns: player.challenges?.baronTakedowns || 0,
riftHeraldTakedowns: player.challenges?.riftHeraldTakedowns || 0,
teamDragonKills: teamDragonKills,
teamBaronKills: teamBaronKills,
teamRiftHeraldKills: teamRiftHeraldKills,
        visionScore: player.visionScore,
        win: player.win,
        durationSeconds: match.info.gameDuration,
        queueId: match.info.queueId
      });
    }

    // 4. Devolver las partidas

    // Calcular resumen de las últimas partidas
    const roleCounts = {};

games.filter(game => game.queueId === 420).slice(0, 10).forEach(game => {
    const role = game.position;
    if (role) roleCounts[role] = (roleCounts[role] || 0) + 1;
});

let mainRole = 'UNKNOWN';
let maxRoleCount = 0;

for (const game of games.filter(game => game.queueId === 420).slice(0, 10)) {
    const role = game.position;

    if (role && roleCounts[role] > maxRoleCount) {
        mainRole = role;
        maxRoleCount = roleCounts[role];
    }
}
const roleGames = games
    .filter(game => game.position === mainRole && game.queueId === 420)
    .slice(0, 5);
   
const totalGames = roleGames.length;
if (totalGames === 0) {
    return res.status(404).json({
        ok: false,
        error: "No se encontraron partidas Ranked Solo/Duo para el rol principal detectado."
    });
}
const sampleWarning = totalGames < 3
    ? `Muestra pequeña: solo ${totalGames} partida${totalGames === 1 ? '' : 's'} analizada${totalGames === 1 ? '' : 's'}.`
    : null;
const wins = roleGames.filter(game => game.win).length;
const losses = totalGames - wins;

const totalKills = roleGames.reduce((sum, game) => sum + game.kills, 0);
const totalDeaths = roleGames.reduce((sum, game) => sum + game.deaths, 0);
const totalAssists = roleGames.reduce((sum, game) => sum + game.assists, 0);
const totalDamage = roleGames.reduce((sum, game) => sum + game.damageToChampions, 0);
const totalTurretDamage = roleGames.reduce((sum, game) => sum + game.damageToTurrets, 0);
const totalDragonTakedowns = roleGames.reduce((sum, game) => sum + game.dragonTakedowns, 0);
const totalBaronTakedowns = roleGames.reduce((sum, game) => sum + game.baronTakedowns, 0);
const totalRiftHeraldTakedowns = roleGames.reduce((sum, game) => sum + game.riftHeraldTakedowns, 0);
const totalTeamDragonKills = roleGames.reduce((sum, game) => sum + game.teamDragonKills, 0);
const totalTeamBaronKills = roleGames.reduce((sum, game) => sum + game.teamBaronKills, 0);
const totalTeamRiftHeraldKills = roleGames.reduce((sum, game) => sum + game.teamRiftHeraldKills, 0);

const totalMinutes = roleGames.reduce(
  (sum, game) => sum + game.durationSeconds / 60,
  0
);
const turretDamagePerMinute = totalMinutes > 0
    ? Math.round(totalTurretDamage / totalMinutes)
    : 0;

const totalCS = roleGames.reduce((sum, game) => sum + game.cs, 0);
const damagePerMinute = totalMinutes > 0
    ? Math.round(totalDamage / totalMinutes)
    : 0;


const totalVisionScore = roleGames.reduce((sum, game) => sum + game.visionScore, 0);
const visionPerMinute = totalMinutes > 0
    ? Number((totalVisionScore / totalMinutes).toFixed(2))
    : 0;
const averageVisionScore = totalGames > 0
    ? Number((totalVisionScore / totalGames).toFixed(1))
    : 0;
    const totalTeamActions = totalKills + totalAssists;
const totalTeamKills = roleGames.reduce((sum, game) => sum + game.teamKills, 0);
const killParticipation = totalTeamKills > 0
    ? Math.round((totalTeamActions / totalTeamKills) * 100)
    : 0;
    const dragonParticipation = totalTeamDragonKills > 0
  ? totalDragonTakedowns / totalTeamDragonKills
  : 0;

const baronParticipation = totalTeamBaronKills > 0
  ? totalBaronTakedowns / totalTeamBaronKills
  : 0;

const riftHeraldParticipation = totalTeamRiftHeraldKills > 0
  ? totalRiftHeraldTakedowns / totalTeamRiftHeraldKills
  : 0;
const summary = {
  totalGames: totalGames,
  analyzedGames: totalGames,
  mainRole: mainRole,
  damagePerMinute: damagePerMinute,
  turretDamagePerMinute: turretDamagePerMinute,
  averageVisionScore: averageVisionScore,
  visionPerMinute: visionPerMinute,
  killParticipation: killParticipation,
  dragonParticipation: dragonParticipation,
baronParticipation: baronParticipation,
riftHeraldParticipation: riftHeraldParticipation,
  wins: wins,
  losses: losses,
  winRate: totalGames > 0
    ? Math.round((wins / totalGames) * 100)
    : 0,

  averageKills: totalGames > 0
    ? Number((totalKills / totalGames).toFixed(1))
    : 0,

  averageDeaths: totalGames > 0
    ? Number((totalDeaths / totalGames).toFixed(1))
    : 0,

  averageAssists: totalGames > 0
    ? Number((totalAssists / totalGames).toFixed(1))
    : 0,

  csPerMinute: totalMinutes > 0
    ? Number((totalCS / totalMinutes).toFixed(2))
    : 0,
kdaRatio: totalDeaths > 0
    ? Number(((totalKills + totalAssists) / totalDeaths).toFixed(2))
    : totalKills + totalAssists,
  averageDamage: totalGames > 0
    ? Math.round(totalDamage / totalGames)
    : 0
};
let performanceLevel = 'NORMAL';
let individualScore = 0;
let teamplayScore = 0;

const objectiveParticipations = [];

if (totalTeamDragonKills > 0) {
  objectiveParticipations.push(summary.dragonParticipation);
}

if (totalTeamBaronKills > 0) {
  objectiveParticipations.push(summary.baronParticipation);
}

if (totalTeamRiftHeraldKills > 0) {
  objectiveParticipations.push(summary.riftHeraldParticipation);
}

const objectiveParticipation = objectiveParticipations.length > 0
  ? objectiveParticipations.reduce((sum, value) => sum + value, 0) / objectiveParticipations.length
  : 0;
  let teamplayBreakdown = {};
  let teamplayAnalysis = {
  strengths: [],
  improvements: []
};
if (summary.mainRole === 'BOTTOM') {
 individualScore += Math.min((summary.damagePerMinute / 800) * 25, 25);
individualScore += Math.min(summary.csPerMinute * 4, 25);
individualScore += Math.min(summary.kdaRatio * 8, 30);
individualScore += Math.min(summary.winRate * 0.2, 20);
const teamplayKillScore = Math.min((summary.killParticipation / 70) * 40, 40);
const teamplayVisionScore = Math.min((summary.visionPerMinute / 1.0) * 10, 10);
const teamplayStructureScore = Math.min((summary.turretDamagePerMinute / 150) * 25, 25);
const teamplayObjectiveScore = Math.min(objectiveParticipation * 25, 25);

teamplayScore =
  teamplayKillScore +
  teamplayVisionScore +
  teamplayStructureScore +
  teamplayObjectiveScore;
  teamplayBreakdown = {
  kills: Math.round(teamplayKillScore),
  vision: Math.round(teamplayVisionScore),
  structures: Math.round(teamplayStructureScore),
  objectives: Math.round(teamplayObjectiveScore),

  killParticipationPercent: Math.round(summary.killParticipation),
  visionPerMinute: summary.visionPerMinute,
  turretDamagePerMinute: summary.turretDamagePerMinute,
  objectiveParticipationPercent: Math.round(objectiveParticipation * 100)
};
if (summary.killParticipation >= 60) {
  teamplayAnalysis.strengths.push(
    `Buena participación en peleas: estuviste presente en el ${Math.round(summary.killParticipation)}% de las kills de tu equipo.`
  );
} else {
  teamplayAnalysis.improvements.push(
    `Tu participación en kills fue del ${Math.round(summary.killParticipation)}%. Podés mejorar estando presente en más peleas importantes con tu equipo.`
  );
}
if (summary.visionPerMinute >= 1.0) {
  teamplayAnalysis.strengths.push(
    `Buena contribución de visión: promediaste ${summary.visionPerMinute.toFixed(2)} de visión por minuto.`
  );
} else {
  teamplayAnalysis.improvements.push(
    `Tu visión fue de ${summary.visionPerMinute.toFixed(2)} por minuto. Podés mejorar colocando visión con más frecuencia, especialmente alrededor de objetivos importantes.`
  );
}
if (summary.turretDamagePerMinute >= 100) {
  teamplayAnalysis.strengths.push(
    `Buena presión sobre estructuras: promediaste ${Math.round(summary.turretDamagePerMinute)} de daño a torres por minuto.`
  );
} else {
  teamplayAnalysis.improvements.push(
    `Tu daño a torres fue de ${Math.round(summary.turretDamagePerMinute)} por minuto. Podés mejorar aprovechando mejor las oportunidades para presionar estructuras.`
  );
}
if (objectiveParticipation >= 0.60) {
  teamplayAnalysis.strengths.push(
    `Buena participación en objetivos: participaste en aproximadamente el ${Math.round(objectiveParticipation * 100)}% de los objetivos principales disponibles.`
  );
} else {
  teamplayAnalysis.improvements.push(
    `Tu participación en objetivos fue aproximadamente del ${Math.round(objectiveParticipation * 100)}%. Podés mejorar rotando antes hacia dragones, Barón y Heraldo cuando tu equipo los disputa.`
  );
}
if (summary.csPerMinute >= 7.0) {
    teamplayAnalysis.strengths.push(
        `Buen farmeo como ADC: promediaste ${summary.csPerMinute} CS por minuto.`
    );
} else if (summary.csPerMinute >= 5.5) {
    teamplayAnalysis.improvements.push(
        `Tu farmeo fue de ${summary.csPerMinute} CS por minuto. Es aceptable, pero como ADC intentá acercarte a 7 CS/min sin perder peleas importantes.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu farmeo fue bajo para ADC: ${summary.csPerMinute} CS por minuto. Estás perdiendo demasiado oro y experiencia; priorizá mejor las oleadas entre peleas y objetivos.`
    );
}
if (summary.damagePerMinute >= 700) {
    teamplayAnalysis.strengths.push(
        `Buen daño como ADC: promediaste ${Math.round(summary.damagePerMinute)} de daño a campeones por minuto.`
    );
} else if (summary.damagePerMinute >= 500) {
    teamplayAnalysis.improvements.push(
        `Tu daño fue de ${Math.round(summary.damagePerMinute)} por minuto. Es aceptable, pero como ADC podés aportar más daño manteniendo una posición segura en las peleas.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu daño fue bajo para ADC: ${Math.round(summary.damagePerMinute)} por minuto. Buscá mejores posiciones en las peleas y aprovechá más oportunidades para atacar sin exponerte.`
    );
}
if (summary.averageDeaths <= 4) {
    teamplayAnalysis.strengths.push(
        `Buena supervivencia como ADC: promediaste ${summary.averageDeaths} muertes por partida.`
    );
} else if (summary.averageDeaths <= 6) {
    teamplayAnalysis.improvements.push(
        `Promediaste ${summary.averageDeaths} muertes por partida. Como ADC, intentá mejorar tu posicionamiento para sobrevivir más tiempo y mantener tu daño en las peleas.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Estás muriendo demasiado como ADC: promediaste ${summary.averageDeaths} muertes por partida. Priorizá tu posicionamiento y evitá entrar demasiado adelante en las peleas.`
    );
}
if (
    summary.csPerMinute >= 7.0 &&
    summary.damagePerMinute >= 700 &&
    summary.averageDeaths > 6
) {
    teamplayAnalysis.improvements.push(
        `Tu farmeo y daño son buenos, pero estás muriendo demasiado. Tu principal área de mejora como ADC es el posicionamiento: mantenete detrás de tu frontline y priorizá sobrevivir para seguir haciendo daño.`
    );
}
if (
    summary.averageDeaths <= 4 &&
    summary.damagePerMinute < 500
) {
    teamplayAnalysis.improvements.push(
        `Sobrevivís bien, pero tu daño como ADC es bajo. Es posible que estés jugando demasiado seguro; buscá más oportunidades para atacar en las peleas sin comprometer tu posicionamiento.`
    );
}
if (
    summary.killParticipation >= 60 &&
    summary.csPerMinute < 5.5
) {
    teamplayAnalysis.improvements.push(
        `Participás mucho en las peleas, pero tu farmeo es bajo. Es posible que estés abandonando demasiadas oleadas para pelear; como ADC, buscá equilibrar mejor las peleas con la recolección de oro y experiencia.`
    );
}
if (
    summary.csPerMinute >= 7.0 &&
    summary.killParticipation < 50
) {
    teamplayAnalysis.improvements.push(
        `Tu farmeo es bueno, pero participás poco en las kills de tu equipo. Es posible que estés priorizando demasiado las oleadas; buscá reconocer cuándo dejar el farm para llegar a una pelea importante.`
    );
}
  console.log('TEAMPLAY BREAKDOWN:', {
  kills: teamplayKillScore,
  vision: teamplayVisionScore,
  structures: teamplayStructureScore,
  objectives: teamplayObjectiveScore,
  total: teamplayScore
});
}
if (summary.mainRole === 'UTILITY') {
    const supportKillScore = Math.min((summary.killParticipation / 70) * 30, 30);
    const supportVisionScore = Math.min((summary.visionPerMinute / 1.5) * 35, 35);
    const supportAssistScore = Math.min((summary.averageAssists / 12) * 20, 20);
    const supportTeamScore = Math.min((summary.winRate * 0.15), 15);

    teamplayScore =
        supportKillScore +
        supportVisionScore +
        supportAssistScore +
        supportTeamScore;

    teamplayBreakdown = {
        kills: Math.round(supportKillScore),
        vision: Math.round(supportVisionScore),
        assists: Math.round(supportAssistScore),
        teamResult: Math.round(supportTeamScore)
    };
    if (summary.killParticipation >= 60) {
    teamplayAnalysis.strengths.push(
        `Buena participación con el equipo: estuviste presente en el ${Math.round(summary.killParticipation)}% de las kills de tu equipo.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu participación en kills fue del ${Math.round(summary.killParticipation)}%. Como support, intentá acompañar más las peleas y rotaciones de tu equipo.`
    );
}
if (summary.visionPerMinute >= 1.0) {
    teamplayAnalysis.strengths.push(
        `Excelente control de visión: promediaste ${summary.visionPerMinute.toFixed(2)} de visión por minuto.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu visión fue de ${summary.visionPerMinute.toFixed(2)} por minuto. Como support, intentá colocar y limpiar visión con más frecuencia.`
    );
}
if (summary.averageAssists >= 8) {
    teamplayAnalysis.strengths.push(
        `Excelente aporte al equipo: promediaste ${summary.averageAssists} asistencias por partida.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Promediaste ${summary.averageAssists} asistencias por partida. Como support, buscá participar más en jugadas junto a tu equipo.`
    );
}if (
    summary.visionPerMinute >= 1.5 &&
    summary.killParticipation < 50
) {
    teamplayAnalysis.improvements.push(
        `Tu control de visión es excelente, pero tu participación en peleas es baja. Como support, asegurate de que colocar visión no te aleje demasiado de tu equipo cuando se prepara una jugada importante.`
    );
}
if (
    summary.killParticipation >= 60 &&
    summary.visionPerMinute < 1.0
) {
    teamplayAnalysis.improvements.push(
        `Participás mucho con tu equipo, pero tu control de visión es bajo. Como support, aprovechá los momentos entre peleas para colocar y limpiar visión sin perder presencia con tu equipo.`
    );
}
if (
    summary.averageAssists >= 10 &&
    summary.killParticipation < 50
) {
    teamplayAnalysis.improvements.push(
        `Tenés muchas asistencias, pero tu participación total en las kills del equipo es baja. Esto puede indicar que estás aportando bien en algunas peleas, pero faltando en otras; buscá mejorar tus rotaciones y presencia con el equipo.`
    );
}
}
if (summary.mainRole === 'JUNGLE') {
  const jungleKillScore = Math.min((summary.killParticipation / 70) * 30, 30);
  const jungleVisionScore = Math.min((summary.visionPerMinute / 1.0) * 15, 15);
  let jungleObjectivePoints = 0;
let jungleObjectiveMaxPoints = 0;

if (totalTeamDragonKills > 0) {
  jungleObjectivePoints += summary.dragonParticipation * 18;
  jungleObjectiveMaxPoints += 18;
}

if (totalTeamBaronKills > 0) {
  jungleObjectivePoints += summary.baronParticipation * 14;
  jungleObjectiveMaxPoints += 14;
}

if (totalTeamRiftHeraldKills > 0) {
  jungleObjectivePoints += summary.riftHeraldParticipation * 8;
  jungleObjectiveMaxPoints += 8;
}

const jungleObjectiveScore =
  jungleObjectiveMaxPoints > 0
    ? (jungleObjectivePoints / jungleObjectiveMaxPoints) * 40
    : 0;
  const jungleTeamScore = Math.min((summary.winRate * 0.15), 15);

  teamplayScore =
    jungleKillScore +
    jungleVisionScore +
    jungleObjectiveScore +
    jungleTeamScore;

  teamplayBreakdown = {
    kills: Math.round(jungleKillScore),
    vision: Math.round(jungleVisionScore),
    objectives: Math.round(jungleObjectiveScore),
    teamResult: Math.round(jungleTeamScore),
    dragonParticipation: Math.round(summary.dragonParticipation * 100),
baronParticipation: Math.round(summary.baronParticipation * 100),
riftHeraldParticipation: Math.round(summary.riftHeraldParticipation * 100)
  };
}
if (summary.mainRole === 'JUNGLE') {
individualScore += Math.min(summary.kdaRatio * 7, 30);
individualScore += Math.min(summary.winRate * 0.25, 25);
individualScore += Math.min((summary.damagePerMinute / 700) * 20, 20);
individualScore += Math.min(summary.csPerMinute * 5, 25);
}
if (summary.mainRole === 'JUNGLE') {
  if (summary.killParticipation >= 60) {
    teamplayAnalysis.strengths.push(
      `Buena presencia en peleas: participaste en el ${Math.round(summary.killParticipation)}% de las kills de tu equipo.`
    );
  } else {
    teamplayAnalysis.improvements.push(
      `Tu participación en kills fue del ${Math.round(summary.killParticipation)}%. Como jungla, podés mejorar tu presencia en ganks y peleas importantes.`
    );
  }
}

if (summary.mainRole === 'JUNGLE') {

  if (totalTeamDragonKills > 0) {
    if (summary.dragonParticipation >= 0.60) {
      teamplayAnalysis.strengths.push(
        `Buena presencia en Dragones: participaste en el ${Math.round(summary.dragonParticipation * 100)}% de los Dragones conseguidos por tu equipo.`
      );
    } else {
      teamplayAnalysis.improvements.push(
        `Tu participación en Dragones fue del ${Math.round(summary.dragonParticipation * 100)}%. Como jungla, buscá preparar y disputar mejor este objetivo.`
      );
    }
  }

  if (totalTeamBaronKills > 0) {
    if (summary.baronParticipation >= 0.60) {
      teamplayAnalysis.strengths.push(
        `Buena presencia en Barón: participaste en el ${Math.round(summary.baronParticipation * 100)}% de los Barones conseguidos por tu equipo.`
      );
    } else {
      teamplayAnalysis.improvements.push(
        `Tu participación en Barón fue del ${Math.round(summary.baronParticipation * 100)}%. Intentá estar presente cuando tu equipo prepare o dispute Barón.`
      );
    }
  }

  if (totalTeamRiftHeraldKills > 0) {
    if (summary.riftHeraldParticipation >= 0.60) {
      teamplayAnalysis.strengths.push(
        `Buena presencia en Heraldo: participaste en el ${Math.round(summary.riftHeraldParticipation * 100)}% de los Heraldos conseguidos por tu equipo.`
      );
    } else {
      teamplayAnalysis.improvements.push(
        `Tu participación en Heraldo fue del ${Math.round(summary.riftHeraldParticipation * 100)}%. Buscá coordinar mejor las rotaciones tempranas hacia este objetivo.`
      );
    }
  }
  if (
    summary.killParticipation >= 60 &&
    objectiveParticipation < 0.50
) {
    teamplayAnalysis.improvements.push(
        `Participás mucho en kills, pero tu presencia en objetivos es baja. Como jungla, intentá convertir mejor los ganks y peleas ganadas en Dragones, Barón o Heraldo.`
    );
}
if (
    objectiveParticipation >= 0.60 &&
    summary.killParticipation < 50
) {
    teamplayAnalysis.improvements.push(
        `Tenés buena presencia en objetivos, pero participás poco en las kills de tu equipo. Como jungla, buscá equilibrar el control de objetivos con más presencia en ganks y peleas importantes.`
    );
}

}
if (summary.mainRole === 'MIDDLE') {
    const midKillScore = Math.min((summary.killParticipation / 70) * 35, 35);
    const midVisionScore = Math.min((summary.visionPerMinute / 1.0) * 10, 10);
    const midDamageScore = Math.min((summary.damagePerMinute / 850) * 30, 30);
    const midObjectiveScore = Math.min(objectiveParticipation * 25, 25);

    teamplayScore =
        midKillScore +
        midVisionScore +
        midDamageScore +
        midObjectiveScore;

    teamplayBreakdown = {
        kills: Math.round(midKillScore),
        vision: Math.round(midVisionScore),
        damage: Math.round(midDamageScore),
        objectives: Math.round(midObjectiveScore)
    };

if (summary.killParticipation >= 60) {
    teamplayAnalysis.strengths.push(
        `Buena presencia como MID: participaste en el ${Math.round(summary.killParticipation)}% de las kills de tu equipo.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu participación en kills fue del ${Math.round(summary.killParticipation)}%. Como MID, buscá rotar y estar presente en más peleas importantes.`
    );
}
if (summary.damagePerMinute >= 700) {
    teamplayAnalysis.strengths.push(
        `Buen daño como MID: promediaste ${Math.round(summary.damagePerMinute)} de daño a campeones por minuto.`
    );
} else if (summary.damagePerMinute >= 500) {
    teamplayAnalysis.improvements.push(
        `Tu daño fue de ${Math.round(summary.damagePerMinute)} por minuto. Es aceptable, pero como MID podés buscar más impacto en peleas y rotaciones.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu daño fue bajo para MID: ${Math.round(summary.damagePerMinute)} por minuto. Buscá mejores oportunidades para hacer daño en línea, rotaciones y peleas de equipo.`
    );
}
if (summary.csPerMinute >= 7.0) {
    teamplayAnalysis.strengths.push(
        `Buen farmeo como MID: promediaste ${summary.csPerMinute} CS por minuto.`
    );
} else if (summary.csPerMinute >= 5.5) {
    teamplayAnalysis.improvements.push(
        `Tu farmeo fue de ${summary.csPerMinute} CS por minuto. Es aceptable, pero como MID intentá mantener mejores oleadas mientras rotás y participás con tu equipo.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu farmeo fue bajo para MID: ${summary.csPerMinute} CS por minuto. Buscá perder menos oleadas y equilibrar mejor el farm con tus rotaciones.`
    );
}
if (summary.averageDeaths <= 4) {
    teamplayAnalysis.strengths.push(
        `Buena supervivencia como MID: promediaste ${summary.averageDeaths} muertes por partida.`
    );
} else if (summary.averageDeaths <= 6) {
    teamplayAnalysis.improvements.push(
        `Promediaste ${summary.averageDeaths} muertes por partida. Como MID, intentá elegir mejor tus entradas y posicionamiento en las peleas.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Estás muriendo demasiado como MID: promediaste ${summary.averageDeaths} muertes por partida. Revisá tu posicionamiento, entradas a peleas y rotaciones arriesgadas.`
    );
}
if (objectiveParticipation >= 0.60) {
    teamplayAnalysis.strengths.push(
        `Buena presencia en objetivos como MID: participaste aproximadamente en el ${Math.round(objectiveParticipation * 100)}% de los objetivos conseguidos por tu equipo.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu participación en objetivos fue aproximadamente del ${Math.round(objectiveParticipation * 100)}%. Como MID, buscá rotar antes para ayudar en Dragones, Barón y Heraldo.`
    );
}
if (
    summary.csPerMinute >= 7.0 &&
    summary.damagePerMinute >= 700 &&
    summary.averageDeaths > 6
) {
    teamplayAnalysis.improvements.push(
        `Tu farmeo y daño son buenos, pero estás muriendo demasiado. Como MID, buscá mejorar tu posicionamiento y elegir mejor cuándo entrar a las peleas para mantener tu impacto sin regalar muertes.`
    );
}
if (
    summary.averageDeaths <= 4 &&
    summary.damagePerMinute < 500
) {
    teamplayAnalysis.improvements.push(
        `Sobrevivís bien, pero tu daño como MID es bajo. Es posible que estés jugando demasiado seguro; buscá más oportunidades para presionar en línea, rotar y aportar daño sin exponerte innecesariamente.`
    );
}
if (
    summary.csPerMinute >= 7.0 &&
    summary.killParticipation < 50
) {
    teamplayAnalysis.improvements.push(
        `Tu farmeo es bueno, pero participás poco en las kills de tu equipo. Como MID, es posible que estés permaneciendo demasiado en línea; buscá mejores momentos para rotar y ayudar en peleas importantes.`
    );
}
}
if (summary.mainRole === 'UTILITY') {
individualScore += Math.min(summary.kdaRatio * 6, 30);
individualScore += Math.min((summary.averageVisionScore / 60) * 30, 30);
individualScore += Math.min(summary.winRate * 0.2, 20);
individualScore += Math.min(summary.averageAssists * 2, 20);
}
if (summary.mainRole === 'MIDDLE') {
individualScore += Math.min((summary.damagePerMinute / 850) * 30, 30);
individualScore += Math.min(summary.csPerMinute * 4, 25);
individualScore += Math.min(summary.kdaRatio * 6.25, 25);
individualScore += Math.min(summary.winRate * 0.2, 20);
}
if (summary.mainRole === 'TOP') {
individualScore += Math.min((summary.damagePerMinute / 750) * 25, 25);
individualScore += Math.min(summary.csPerMinute * 4, 25);
individualScore += Math.min(summary.kdaRatio * 6.25, 25);
individualScore += Math.min(summary.winRate * 0.25, 25);
}
individualScore = Math.round(individualScore);
if (summary.mainRole === 'TOP') {
    const topKillScore = Math.min((summary.killParticipation / 65) * 25, 25);
    const topDamageScore = Math.min((summary.damagePerMinute / 750) * 25, 25);
    const topStructureScore = Math.min((summary.turretDamagePerMinute / 150) * 30, 30);
    const topObjectiveScore = Math.min(objectiveParticipation * 20, 20);

    teamplayScore =
        topKillScore +
        topDamageScore +
        topStructureScore +
        topObjectiveScore;

    teamplayBreakdown = {
        kills: Math.round(topKillScore),
        damage: Math.round(topDamageScore),
        structures: Math.round(topStructureScore),
        objectives: Math.round(topObjectiveScore)
    };

if (summary.killParticipation >= 55) {
    teamplayAnalysis.strengths.push(
        `Buena participación como TOP: estuviste presente en el ${Math.round(summary.killParticipation)}% de las kills de tu equipo.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu participación en kills fue del ${Math.round(summary.killParticipation)}%. Como TOP, buscá mejores momentos para agruparte, usar tus rotaciones y participar en peleas importantes.`
    );
}
if (summary.damagePerMinute >= 650) {
    teamplayAnalysis.strengths.push(
        `Buen daño como TOP: promediaste ${Math.round(summary.damagePerMinute)} de daño a campeones por minuto.`
    );
} else if (summary.damagePerMinute >= 450) {
    teamplayAnalysis.improvements.push(
        `Tu daño fue de ${Math.round(summary.damagePerMinute)} por minuto. Es aceptable, pero como TOP podés buscar más impacto en peleas y enfrentamientos importantes.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu daño fue bajo para TOP: ${Math.round(summary.damagePerMinute)} por minuto. Buscá aprovechar mejor tus ventajas de línea y aportar más daño cuando te agrupás con el equipo.`
    );
}
if (summary.csPerMinute >= 7.0) {
    teamplayAnalysis.strengths.push(
        `Buen farmeo como TOP: promediaste ${summary.csPerMinute} CS por minuto.`
    );
} else if (summary.csPerMinute >= 5.5) {
    teamplayAnalysis.improvements.push(
        `Tu farmeo fue de ${summary.csPerMinute} CS por minuto. Es aceptable, pero como TOP intentá aprovechar mejor las oleadas y mantener presión en side lane.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu farmeo fue bajo para TOP: ${summary.csPerMinute} CS por minuto. Buscá perder menos oleadas y aprovechar mejor el oro y experiencia disponibles en side lane.`
    );
}
if (summary.turretDamagePerMinute >= 120) {
    teamplayAnalysis.strengths.push(
        `Buena presión sobre estructuras como TOP: promediaste ${Math.round(summary.turretDamagePerMinute)} de daño a torres por minuto.`
    );
} else if (summary.turretDamagePerMinute >= 60) {
    teamplayAnalysis.improvements.push(
        `Tu presión sobre estructuras fue moderada: ${Math.round(summary.turretDamagePerMinute)} de daño a torres por minuto. Como TOP, buscá convertir mejor tus ventajas y oleadas en daño a torres.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu presión sobre estructuras fue baja: ${Math.round(summary.turretDamagePerMinute)} de daño a torres por minuto. Como TOP, aprovechá mejor las ventanas de side lane y split push para generar presión.`
    );
}
if (objectiveParticipation >= 0.50) {
    teamplayAnalysis.strengths.push(
        `Buena presencia en objetivos como TOP: participaste aproximadamente en el ${Math.round(objectiveParticipation * 100)}% de los objetivos conseguidos por tu equipo.`
    );
} else {
    teamplayAnalysis.improvements.push(
        `Tu participación en objetivos fue aproximadamente del ${Math.round(objectiveParticipation * 100)}%. Como TOP, evaluá cuándo conviene mantener presión en side lane y cuándo agruparte para objetivos importantes.`
    );
}
if (
    summary.killParticipation < 50 &&
    summary.turretDamagePerMinute >= 120
) {
    teamplayAnalysis.strengths.push(
        `Aunque participás menos en las kills del equipo, estás generando mucha presión sobre estructuras. Esto puede indicar un buen uso del split push y la presión en side lane.`
    );
}
if (
    summary.killParticipation < 50 &&
    summary.turretDamagePerMinute < 60
) {
    teamplayAnalysis.improvements.push(
        `Participás poco en las kills y también generás poca presión sobre estructuras. Como TOP, necesitás convertir mejor tu tiempo en side lane o agruparte más con tu equipo cuando no podés generar presión.`
    );
}
if (
    summary.csPerMinute >= 7.0 &&
    summary.turretDamagePerMinute >= 120 &&
    summary.killParticipation < 50
) {
    teamplayAnalysis.strengths.push(
        `Estás aprovechando muy bien el side lane: mantenés buen farmeo y mucha presión sobre estructuras aunque participes menos en peleas. Tu split push está generando valor para el equipo.`
    );
}
}
if (individualScore >= 85) {    performanceLevel = 'EXCELENTE';
}
else if (individualScore >= 70) {
    performanceLevel = 'BUENO';
}
else if (individualScore < 50) {
    performanceLevel = 'BAJO';
}
console.log('TEAMPLAY FINAL:', teamplayScore);
    res.json({
      ok: true,
      account: {
        gameName: account.gameName,
        tagLine: account.tagLine
      },
      summary: summary,
      performanceLevel: performanceLevel,
      individualScore: individualScore,
      teamplayScore: Math.round(teamplayScore),
      teamplayBreakdown: teamplayBreakdown,
      sampleWarning: sampleWarning,
      teamplayAnalysis: teamplayAnalysis,
      games: games
      
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error interno al analizar el historial"
    });
  }
});
app.listen(PORT, () => {
  console.log(`RiotAnalytics funcionando en http://localhost:${PORT}`);
});
