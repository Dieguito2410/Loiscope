alert("APP NUEVO");
const DATA_DRAGON_VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
const DATA_DRAGON_CHAMPION_URL = version => `https://ddragon.leagueoflegends.com/cdn/${version}/data/es_MX/champion.json`;
const SAMIRA_PROFILE_URL = 'data/champions/samira.json?v=2';
const JHIN_PROFILE_URL = 'data/champions/jhin.json';
const KAISA_PROFILE_URL = 'data/champions/kaisa.json';
const MISSFORTUNE_PROFILE_URL = 'data/champions/missfortune.json';
const JINX_PROFILE_URL = 'data/champions/jinx.json';
const NILAH_PROFILE_URL = 'data/champions/nilah.json';
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
            loadingStatus.style.color = '#34d399';
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
    Nilah: NILAH_PROFILE_URL
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