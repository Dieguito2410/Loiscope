alert("APP NUEVO");
const DATA_DRAGON_VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
const DATA_DRAGON_CHAMPION_URL = version => `https://ddragon.leagueoflegends.com/cdn/${version}/data/es_MX/champion.json`;
const SAMIRA_PROFILE_URL = 'data/champions/samira.json?v=2';
const JHIN_PROFILE_URL = 'data/champions/jhin.json';
const KAISA_PROFILE_URL = 'data/champions/kaisa.json';
const MISSFORTUNE_PROFILE_URL = 'data/champions/missfortune.json';
const JINX_PROFILE_URL = 'data/champions/jinx.json';
const NILAH_PROFILE_URL = 'data/champions/nilah.json';
const NAUTILUS_PROFILE_URL = 'data/champions/nautilus.json';
const LEONA_PROFILE_URL = 'data/champions/leona.json?v=2';
const PYKE_PROFILE_URL = 'data/champions/pyke.json';
const SWAIN_PROFILE_URL = 'data/champions/swain.json';
const KARMA_PROFILE_URL = 'data/champions/karma.json';
const NOCTURNE_PROFILE_URL = 'data/champions/nocturne.json';
const VIEGO_PROFILE_URL = 'data/champions/viego.json';
const WARWICK_PROFILE_URL = 'data/champions/warwick.json';
const MEL_PROFILE_URL = 'data/champions/mel.json';
const VEIGAR_PROFILE_URL = 'data/champions/veigar.json';
const VEX_PROFILE_URL = 'data/champions/vex.json';
const YORICK_PROFILE_URL = 'data/champions/yorick.json';
const DRMUNDO_PROFILE_URL = 'data/champions/drmundo.json';
const KENNEN_PROFILE_URL = 'data/champions/kennen.json';
function getElement(id) {
    return document.getElementById(id);
}

function setText(id, text) {
    const element = getElement(id);
    if (element) {
        element.textContent = text;
    }
}

function setHtml(id, html) {
    const element = getElement(id);
    if (element) {
        element.innerHTML = html;
    }
}

function setDisabled(id, disabled) {
    const element = getElement(id);
    if (element) {
        element.disabled = disabled;
    }
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Fetch failed for ${url}: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

function buildChampionOptions(championData) {
    const champions = Object.values(championData)
    .filter((champion, index, array) =>
        index === array.findIndex(c => c.name === champion.name)
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));    const select = getElement('champion');
    if (!select) return;

    select.innerHTML = '';
    champions.forEach(champion => {
        const option = document.createElement('option');
        option.value = champion.id;
        option.textContent = champion.name;
        option.dataset.title = champion.title;
        select.appendChild(option);
    });
}

function buildListItems(items) {
    return items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function buildTagItems(items) {
    return items.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('');
}

function clearResultFields() {
    setText('resTitulo', '—');
    setText('resClaseBadge', 'Clases: —');
    setText('resInvocadorBadge', 'Invocador: —');
    setText('resEstrategia', 'Cargando estrategia...');
    setText('resSinergia', 'Cargando sinergias...');
    setHtml('resFarm', '<strong>Minuto 10:</strong> --<br><strong>Minuto 20: --</strong>');
    setText('resSubtext', 'Cargando análisis de oleadas...');
    setHtml('resStart', '<li>Cargando...</li>');
    setHtml('resCore', '<li>Cargando...</li>');
    setHtml('resSituacional', '<span class="tag">Cargando...</span>');
    setText('resConsejo', 'Cargando consejo...');
}

function renderUnavailableChampion(championName, summoner) {
    setText('resTitulo', championName);
    setText('resClaseBadge', 'Clases: —');
    setText('resInvocadorBadge', `Invocador: ${summoner}`);
    setText('resEstrategia', `El campeón ${championName} aún no está disponible en RiotAnalytics Beta.`);
    setText('resSinergia', 'Disponible próximamente.');
    setHtml('resFarm', '<strong>Minuto 10:</strong> --<br><strong>Minuto 20:</strong> --');
    setText('resSubtext', 'Más información se actualizará cuando el campeón esté disponible.');
    setHtml('resStart', '<li>—</li>');
    setHtml('resCore', '<li>—</li>');
    setHtml('resSituacional', '<span class="tag">—</span>');
    setHtml('resConsejo', `<strong>El campeón ${escapeHtml(championName)} aún no está disponible en RiotAnalytics Beta.</strong>`);
}

function renderSamiraProfile(profile, championName, championTitle, summoner) {
    const roles = Array.isArray(profile.roles) ? profile.roles.join(' / ') : '—';
    const synergies = Array.isArray(profile.synergies) ? profile.synergies.join(', ') : '—';
    const tips = Array.isArray(profile.tips) ? profile.tips.map(tip => escapeHtml(tip)).join('<br>') : '—';
    const startItems = Array.isArray(profile.items?.start) ? buildListItems(profile.items.start) : '<li>—</li>';
    const coreItems = Array.isArray(profile.items?.core) ? buildListItems(profile.items.core) : '<li>—</li>';
    const situationalTags = Array.isArray(profile.items?.situational) ? buildTagItems(profile.items.situational) : '<span class="tag">—</span>';

    setText('resTitulo', `${championName} — ${championTitle}`);
    setText('resClaseBadge', `Clases: ${roles}`);
    setText('resInvocadorBadge', `Invocador: ${summoner}`);
    setHtml('resEstrategia', `<strong>Estilo de combate:</strong> ${escapeHtml(profile.strategy?.style || '—')}<br><br><strong>Objetivo:</strong> ${escapeHtml(profile.strategy?.objective || '—')}`);
    setText('resSinergia', synergies);
    setHtml('resFarm', `<strong>Minuto 10:</strong> ${escapeHtml(profile.cs?.['10'] || '—')}<br><strong>Minuto 20:</strong> ${escapeHtml(profile.cs?.['20'] || '—')}`);
    setText('resSubtext', profile.cs?.note || '—');
    setHtml('resStart', startItems);
    setHtml('resCore', coreItems);
    setHtml('resSituacional', situationalTags);
    setHtml('resConsejo', tips);
const resultado = getElement('resultado');
if (resultado) {
    resultado.style.display = 'block';
}
}
async function loadChampionList() {
    try {
        setText('loadingStatus', 'Conectando con la base de datos oficial de Riot Games (es_MX)...');
        const versions = await fetchJson(DATA_DRAGON_VERSIONS_URL);
        const latestVersion = Array.isArray(versions) && versions.length ? versions[0] : null;
        if (!latestVersion) {
            throw new Error('No se encontró la versión más reciente de Data Dragon.');
        }

        const championData = await fetchJson(DATA_DRAGON_CHAMPION_URL(latestVersion));
        buildChampionOptions(championData.data);
        setDisabled('champion', false);
        setDisabled('btnAnalizar', false);
        setText('loadingStatus', `Base de datos sincronizada correctamente (Parche ${latestVersion} - es_MX).`);
        const loadingStatus = getElement('loadingStatus');
        if (loadingStatus) {
            loadingStatus.style.color = '#08b8c4';        
        }
    } catch (error) {
        console.error('Error al cargar campeones de Riot Data Dragon:', error);
        setText('loadingStatus', 'Error al conectar con la base de datos oficial de Riot Games. Verifica tu conexión e intenta nuevamente.');
        const loadingStatus = getElement('loadingStatus');
        if (loadingStatus) {
            loadingStatus.style.color = '#f87171';
        }
        setDisabled('champion', true);
        setDisabled('btnAnalizar', true);
    }
}

async function handleAnalyzeClick() {
    const championSelect = getElement('champion');
    const summonerInput = getElement('summoner');
    if (!championSelect || !summonerInput) {
        return;
    }

    const championId = championSelect.value;
    console.log('CHAMPION ID:', championId);
    const championName = championSelect.options[championSelect.selectedIndex]?.text || championId;
    const championTitle = championSelect.options[championSelect.selectedIndex]?.dataset.title || '';
    const summoner = summonerInput.value.trim() || 'InvocadorPrueba#LAS';

    const localProfiles = {
    Samira: SAMIRA_PROFILE_URL,
    Jhin: JHIN_PROFILE_URL,
    Kaisa: KAISA_PROFILE_URL,
    Jade_MissFortune: MISSFORTUNE_PROFILE_URL,
    Jinx: JINX_PROFILE_URL,
    Nilah: NILAH_PROFILE_URL,
    Nautilus: NAUTILUS_PROFILE_URL,
    Jade_Leona: LEONA_PROFILE_URL,
    Pyke: PYKE_PROFILE_URL,
    Swain: SWAIN_PROFILE_URL,
    Karma: KARMA_PROFILE_URL,
    Nocturne: NOCTURNE_PROFILE_URL,
    Viego: VIEGO_PROFILE_URL,
    Warwick: WARWICK_PROFILE_URL,
    Mel: MEL_PROFILE_URL,
    Veigar: VEIGAR_PROFILE_URL,
    Vex: VEX_PROFILE_URL,
    Yorick: YORICK_PROFILE_URL,
    DrMundo: DRMUNDO_PROFILE_URL,
    Kennen: KENNEN_PROFILE_URL
};

const profileUrl = localProfiles[championId];

if (profileUrl) {
    try {
        const profile = await fetchJson(profileUrl);
        renderSamiraProfile(profile, championName, championTitle, summoner);
    } catch (error) {
        console.error(`Error al cargar el perfil local de ${championName}:`, error);
        renderUnavailableChampion(championName, summoner);
        setText('resConsejo', `No se pudo cargar el perfil local de ${championName}. Intenta recargar la página.`);
    }
} else {
    renderUnavailableChampion(championName, summoner);
}
}
function initApp() {
    console.log('INIT APP NUEVO');

    clearResultFields();
    setDisabled('champion', true);
    setDisabled('btnAnalizar', true);

    const analyzeButton = getElement('btnAnalizar');

    if (analyzeButton) {
        console.log('BOTON ANALIZAR CONECTADO');
        analyzeButton.addEventListener('click', handleAnalyzeClick);
    }

    loadChampionList();
}

window.addEventListener('load', initApp);

const btnBuscarJugador = document.getElementById('btnBuscarJugador');
console.log('BOTON BUSCAR JUGADOR:', btnBuscarJugador);

btnBuscarJugador.addEventListener('click', async () => {
    const gameName = document.getElementById('riotGameName').value.trim();
    const tagLine = document.getElementById('riotTagLine').value.trim();
    const playerResult = document.getElementById('playerResult');
    const playerHistory = document.getElementById('playerHistory');

    if (!gameName || !tagLine) {
        playerResult.textContent = 'Ingresá Riot ID y Tag.';
        return;
    }

    playerResult.innerHTML = `
    <div class="search-loading">
        <span class="loading-spinner"></span>
        <span>Buscando jugador...</span>
    </div>
`;

playerHistory.innerHTML = `
    <div class="search-loading">
        <span class="loading-spinner"></span>
        <span>Analizando últimas 5 partidas...</span>
    </div>
`;
    try {
        const response = await fetch(
            `/api/analyze/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
        );

        const data = await response.json();

       if (!response.ok || !data.ok) {
    playerResult.innerHTML = `
        <div class="search-error">
            <strong>No pudimos encontrar al jugador.</strong>
            <p>${data.message || 'Verificá el Riot ID y el Tag e intentá nuevamente.'}</p>
        </div>
    `;
    playerHistory.innerHTML = '';
    return;
}
        

        const minutos = Math.floor(data.game.durationSeconds / 60);
        const segundos = data.game.durationSeconds % 60;
        const duracion = `${minutos}:${String(segundos).padStart(2, '0')}`;

        playerResult.innerHTML = `
            <div class="card-box">
<div class="section-title">ÚLTIMA PARTIDA</div>
<h3>${data.account.gameName}#${data.account.tagLine}</h3>
            <p><strong>Campeón:</strong> ${data.player.champion}</p>
              <p><strong>Posición:</strong> ${{ BOTTOM: 'ADC', UTILITY: 'SUPPORT', MIDDLE: 'MID', TOP: 'TOP', JUNGLE: 'JUNGLE' }[data.player.position] || data.player.position}</p>
               <div class="match-stats-grid">
    <div class="match-stat">
        <span class="match-stat-label">K/D/A</span>
        <strong>${data.player.kills} / ${data.player.deaths} / ${data.player.assists}</strong>
    </div>
    <div class="match-stat">
        <span class="match-stat-label">CS</span>
        <strong>${data.player.cs}</strong>
    </div>
    <div class="match-stat">
        <span class="match-stat-label">ORO</span>
        <strong>${data.player.gold}</strong>
    </div>
    <div class="match-stat">
        <span class="match-stat-label">DAÑO A CAMPEONES</span>
        <strong>${data.player.damageToChampions}</strong>
    </div>
</div>                <p><strong>Visión:</strong> ${data.player.visionScore}</p>
                <p><strong>Duración:</strong> ${duracion}</p>
                <p><strong>Resultado:</strong> ${data.player.win ? 'VICTORIA' : 'DERROTA'}</p>
            </div>
        `;
const historyResponse = await fetch(
    `/api/analyze-history/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
);

const historyData = await historyResponse.json();
console.log('HISTORY DATA:', historyData);
if (historyResponse.ok && historyData.ok) {
    const summary = historyData.summary;

   const roleDisplayNames = {
  TOP: 'TOP',
  JUNGLE: 'JUNGLE',
  MIDDLE: 'MID',
  BOTTOM: 'ADC',
  UTILITY: 'SUPPORT'
};

const displayRole = roleDisplayNames[summary.mainRole] || summary.mainRole;
    playerHistory.innerHTML = `
        <div class="card-box">
          <div class="section-title">ANÁLISIS DE ROL PRINCIPAL</div>
<h3>Análisis de ${summary.analyzedGames} ${summary.analyzedGames === 1 ? 'partida' : 'partidas'} como ${displayRole}</h3>
          ${historyData.sampleWarning ? `
    <p><strong>⚠️ ${historyData.sampleWarning}</strong></p>
` : ''}
            <div class="analysis-stats-grid">
    <div class="analysis-stat">
        <span class="analysis-stat-label">ROL PRINCIPAL</span>
        <strong>${displayRole}</strong>
    </div>
    <div class="analysis-stat">
        <span class="analysis-stat-label">VICTORIAS / DERROTAS</span>
        <strong>${summary.wins} / ${summary.losses}</strong>
    </div>
    <div class="analysis-stat">
        <span class="analysis-stat-label">WIN RATE</span>
        <strong>${summary.winRate}%</strong>
    </div>
    <div class="analysis-stat">
        <span class="analysis-stat-label">K/D/A PROMEDIO</span>
        <strong>${summary.averageKills} / ${summary.averageDeaths} / ${summary.averageAssists}</strong>
    </div>
    <div class="analysis-stat">
        <span class="analysis-stat-label">CS POR MINUTO</span>
        <strong>${summary.csPerMinute}</strong>
    </div>
    <div class="analysis-stat">
        <span class="analysis-stat-label">KDA RATIO</span>
        <strong>${summary.kdaRatio}</strong>
    </div>
    <div class="analysis-stat">
        <span class="analysis-stat-label">RENDIMIENTO</span>
        <strong>${historyData.performanceLevel}</strong>
    </div>
</div>
            <div class="analysis-scores">
    <div class="analysis-score">
        <span class="analysis-score-label">INDIVIDUAL SCORE</span>
        <strong>${historyData.individualScore}<small>/100</small></strong>
    </div>
    <div class="analysis-score">
        <span class="analysis-score-label">TEAMPLAY SCORE</span>
        <strong>${historyData.teamplayScore}<small>/100</small></strong>
    </div>
</div>
<div class="teamplay-breakdown-grid">
${summary.mainRole === 'JUNGLE' ? `
    <p><strong>Kill Participation:</strong> ${historyData.teamplayBreakdown.kills}/30</p>
    <p><strong>Vision:</strong> ${historyData.teamplayBreakdown.vision}/15</p>
    <p><strong>Objectives:</strong> ${historyData.teamplayBreakdown.objectives}/40</p>
    <p><strong>Team Result:</strong> ${historyData.teamplayBreakdown.teamResult}/15</p>
` : summary.mainRole === 'UTILITY' ? `
    <p><strong>Kill Participation:</strong> ${historyData.teamplayBreakdown.kills}/30</p>
    <p><strong>Vision:</strong> ${historyData.teamplayBreakdown.vision}/35</p>
    <p><strong>Assists:</strong> ${historyData.teamplayBreakdown.assists}/20</p>
    <p><strong>Team Result:</strong> ${historyData.teamplayBreakdown.teamResult}/15</p>
` : summary.mainRole === 'TOP' ? `
    <p><strong>Kill Participation:</strong> ${historyData.teamplayBreakdown.kills}/25</p>
    <p><strong>Damage:</strong> ${historyData.teamplayBreakdown.damage}/25</p>
    <p><strong>Structures:</strong> ${historyData.teamplayBreakdown.structures}/30</p>
    <p><strong>Objectives:</strong> ${historyData.teamplayBreakdown.objectives}/20</p>
    ` : summary.mainRole === 'MIDDLE' ? `
    <p><strong>Kill Participation:</strong> ${historyData.teamplayBreakdown.kills}/35</p>
    <p><strong>Vision:</strong> ${historyData.teamplayBreakdown.vision}/10</p>
    <p><strong>Damage:</strong> ${historyData.teamplayBreakdown.damage}/30</p>
    <p><strong>Objectives:</strong> ${historyData.teamplayBreakdown.objectives}/25</p>
` : `
    <p><strong>Kill Participation:</strong> ${historyData.teamplayBreakdown.kills}/40</p>
    <p><strong>Vision:</strong> ${historyData.teamplayBreakdown.vision}/10</p>
    <p><strong>Structures:</strong> ${historyData.teamplayBreakdown.structures}/25</p>
    <p><strong>Objectives:</strong> ${historyData.teamplayBreakdown.objectives}/25</p>
   `}
</div>
<h4>Fortalezas</h4>
${historyData.teamplayAnalysis.strengths
  .map(item => `<p>✅ ${item}</p>`)
  .join('')}

<h4>Aspectos a mejorar</h4>
${historyData.teamplayAnalysis.improvements
  .map(item => `<p>⚠️ ${item}</p>`)
  .join('')}
        </div>
    `;
} else {
    playerHistory.innerHTML = `
        <div class="search-error">
            <strong>No pudimos completar el análisis del historial.</strong>
            <p>${historyData.error || historyData.message || 'No se pudieron obtener las partidas. Intentá nuevamente más tarde.'}</p>
        </div>
    `;
}
    } catch (error) {
        console.error(error);
        playerResult.innerHTML = `
    <div class="search-error">
        <strong>Error al conectar con LOISCOPE.</strong>
        <p>No pudimos completar la búsqueda. Intentá nuevamente más tarde.</p>
    </div>
`;
playerHistory.innerHTML = '';
    }
});
// LOISCOPE — Navegación entre secciones
const navTabs = document.querySelectorAll('.main-nav .nav-tab');
const playerAnalyzerSection = document.getElementById('playerAnalyzerSection');
const championGuidesSection = document.getElementById('championGuidesSection');

function showSection(section) {
    const showPlayer = section === 'player';

    playerAnalyzerSection.style.display = showPlayer ? 'block' : 'none';
    championGuidesSection.style.display = showPlayer ? 'none' : 'block';

    navTabs[0].classList.toggle('active', showPlayer);
    navTabs[1].classList.toggle('active', !showPlayer);
}

navTabs[0].addEventListener('click', () => showSection('player'));
navTabs[1].addEventListener('click', () => showSection('guides'));

showSection('player');