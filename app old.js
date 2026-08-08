const buildsOficiales = {
    miss_fortune: {
        clase: "Marksman / Daño de Ráfaga y Letalidad",
        estilo: "Tirador Enfocado en Daño Crítico, Letalidad y Habilidades en Área",
        objetivo: "Destruir formaciones enemigas enteras combinando ralentizaciones con una definitiva canalizada perfecta.",
        sinergia: "<strong>[Support] Soportes de control en área o engage fuerte (ej. Leona, Nautilus, Morgana):</strong> Mantienen al rival quieto para tu definitiva.",
        farm10: "78 - 88 súbditos (CS)",
        farm20: "175 - 205 súbditos (CS)",
        farmSub: "Aprovechar la pasiva para alternar objetivos y asegurar bajas rápidas en súbditos de asedio.",
        inicio: ["Espada de Doran", "Poción de vida"],
        core: ["Recaudadora", "Botas de berserker", "Filo del Infinito", "Cañón de fuego rápido"],
        situacionales: ["Recordatorio mortal", "Cimitarra mercurial", "Fauces de Malmortius"],
        consejo: "Usa tu pasiva 'Inciso' cambiando de objetivo constantemente y posiciona tu 'Lluvia de balas' para bloquear rutas antes de tirar la definitiva."
    },
    marksman_critical: {
        clase: "Marksman / Crítico y Daño Sostenido",
        estilo: "Tirador Tradicional Enfocado en Crítico y Golpes Críticos Masivos",
        objetivo: "Mantenerse seguro en retaguardia y capitalizar los intercambios largos de daño básico.",
        sinergia: "<strong>[Support] Soportes de utilidad o engage (ej. Nautilus, Lux):</strong> Facilitan asegurar ventajas en fase de líneas.",
        farm10: "78 - 88 súbditos (CS)",
        farm20: "175 - 205 súbditos (CS)",
        farmSub: "Asegurar oro constante mediante presión en línea y control de oleadas.",
        inicio: ["Espada de Doran", "Poción de vida"],
        core: ["Matakrakens", "Grebas del Berserker", "Filo del Infinito", "Cañón de Fuego Rápido"],
        situacionales: ["Recordatorio mortal", "Cimitarra mercurial", "Arca de Axión"],
        consejo: "Prioriza mantener tu espacio de seguridad y golpea al objetivo disponible más cercano."
    },
    marksman_as: {
        clase: "Marksman / Velocidad de Ataque y Proyectiles Múltiples",
        estilo: "Tirador de Proyectiles Múltiples y Limpieza en Área",
        objetivo: "Aplicar efectos de impacto masivos en teamfights con la ayuda del Huracán de Runaan.",
        sinergia: "<strong>[Support] Protectores o Encantadores (ej. Lulu, Milio, Janna):</strong> Aseguran tu supervivencia.",
        farm10: "78 - 88 súbditos (CS)",
        farm20: "175 - 205 súbditos (CS)",
        farmSub: "Optimizar la recolección para acelerar los picos de velocidad de ataque y crítico.",
        inicio: ["Espada de Doran", "Poción de vida"],
        core: ["Matakrakens", "Grebas del Berserker", "Huracán de Runaan", "Filo del Infinito"],
        situacionales: ["Recordatorio mortal", "Cimitarra mercurial", "Arca de Axión"],
        consejo: "Aprovecha los rayos expansivos del Huracán de Runaan en peleas grupales."
    },
    as_onhit: {
        clase: "Marksman / On-Hit Hipercarry",
        estilo: "Especialista en Velocidad de Ataque y Daño Porcentual por Impacto",
        objetivo: "Derretir tanques y objetivos prioritarios aprovechando efectos por segundo.",
        sinergia: "<strong>[Support] Soportes de peel y escudos:</strong> Tu prioridad absoluta es mantenerte con vida.",
        farm10: "75 - 85 súbditos (CS)",
        farm20: "170 - 200 súbditos (CS)",
        farmSub: "Controlar el ritmo de la línea asegurando last hits constantes.",
        inicio: ["Espada de Doran", "Poción de vida"],
        core: ["Guinsoo", "Grebas del Berserker", "Huracán de Runaan", "Hoja del rey arruinado"],
        situacionales: ["Recordatorio mortal", "Cimitarra mercurial", "Ángel de la guarda"],
        consejo: "El posicionamiento milimétrico te permite limpiar oleadas y golpear múltiples blancos."
    },
    luchador: {
        clase: "Fighter / Skirmisher",
        estilo: "Luchador de Escaramuzas y Sustein en Combate",
        objetivo: "Dominar duelos individuales y presionar líneas laterales.",
        sinergia: "<strong>[Compañeros] Junglas de control:</strong> Facilitan la obtención de ventajas tempranas.",
        farm10: "70 - 85 súbditos (CS)",
        farm20: "160 - 190 súbditos (CS)",
        farmSub: "Mantener presión constante para forzar respuestas defensivas.",
        inicio: ["Escudo de Doran", "Poción de vida"],
        core: ["Bebedor de sangre", "Botas de mercurio", "Guantelete de Sterak", "Danza de la muerte"],
        situacionales: ["Cimitarra mercurial", "Recordatorio mortal", "Ángel de la guarda"],
        consejo: "Usa tu pico de poder intermedio para dominar duelos."
    },
    tanque: {
        clase: "Tank / Vanguard",
        estilo: "Tanque de Línea Frontal y Control de Masas",
        objetivo: "Absorber daño crítico y liderar las iniciaciones del equipo.",
        sinergia: "<strong>[Compañeros] Magos o daño en área:</strong> Aprovechan el bloqueo prolongado.",
        farm10: "50 - 65 súbditos (CS)",
        farm20: "120 - 150 súbditos (CS)",
        farmSub: "Priorizar supervivencia defensiva.",
        inicio: ["Escudo de Doran", "Poción de vida"],
        core: ["Placas de acero", "Malla de espinas", "Coraza del hombre muerto", "Apariencia espiritual"],
        situacionales: ["Malla de fuego", "Warmog", "Rostro espiritual"],
        consejo: "Calcula los tiempos de ingreso."
    },
    mago: {
        clase: "Mage / Control Burst",
        estilo: "Mago de Daño Mágico a Distancia y Control de Zonas",
        objetivo: "Desgastar rivales desde lejos.",
        sinergia: "<strong>[Compañeros] Tanques de protección:</strong> Te protegen.",
        farm10: "75 - 90 súbditos (CS)",
        farm20: "180 - 210 súbditos (CS)",
        farmSub: "Asegurar últimos golpes.",
        inicio: ["Anillo de Doran", "Poción de vida"],
        core: ["Tempestad de luden", "Botas de hechicero", "Lumbria", "Sombrero mortifero de rabadon"],
        situacionales: ["Reloj de arena de Zhonya", "Velo del hada de la muerte", "Bastón del vacío"],
        consejo: "Mantén distancia prudente."
    },
    asesino: {
        clase: "Assassin / Slayer",
        estilo: "Asesino de Movilidad Extrema y Eliminación Súbita",
        objetivo: "Neutralizar al objetivo principal.",
        sinergia: "<strong>[Compañeros] Con visión:</strong> Permiten rotar.",
        farm10: "65 - 80 súbditos (CS)",
        farm20: "150 - 180 súbditos (CS)",
        farmSub: "Aprovechar rotaciones.",
        inicio: ["Espada larga", "Poción de vida"],
        core: ["Youmuu", "Botas de lucidez", "Recaudadora", "Filo de la noche"],
        situacionales: ["Ángel de la guarda", "Recordatorio mortal", "Rencor de Serylda"],
        consejo: "Entra tras gastar habilidades clave."
    },
    soporte: {
        clase: "Support / Enchanter",
        estilo: "Soporte de Utilidad, Curación o Control de Visión",
        objetivo: "Maximizar supervivencia de aliados.",
        sinergia: "<strong>[Compañeros] Hipercaris:</strong> Maximizan tu eficiencia.",
        farm10: "5 - 15 súbditos (CS)",
        farm20: "10 - 25 súbditos (CS)",
        farmSub: "Depender de pasiva de soporte.",
        inicio: ["Atlas mundial", "Poción de vida"],
        core: ["Mandato imperial", "Botas de lucidez", "Renovador de Moonstone", "Redención"],
        situacionales: ["Crisol de Mikael", "Incensario ardiente", "Bastón de aguas fluidas"],
        consejo: "Coloca centinelas en objetivos."
    }
};

let itemsData = {};
let championsData = {};
let buildsData = {};

function obtenerPerfilCampeon(nombre) {
    if (nombre === "Miss Fortune") return buildsData.miss_fortune;
    const onHitChamps = ["Kalista", "Kog'Maw"];
    if (onHitChamps.includes(nombre)) return buildsData.as_onhit;;
    const runaanAttackSpeedChamps = ["Jinx", "Twitch", "Kayle", "Varus", "Master Yi"];
    if (runaanAttackSpeedChamps.includes(nombre)) return buildsData.marksman_as;
    const criticalMarksmen = ["Caitlyn", "Draven", "Ezreal", "Jhin", "Lucian", "Samira", "Sivir", "Tristana", "Vayne", "Xayah", "Zeri", "Aphelios", "Smolder", "Akshan", "Kindred", "Ashe", "Kai'Sa", "Senna"];
    if (criticalMarksmen.includes(nombre)) return buildsData.marksman_critical;;
    const tanques = ["Malphite", "Amumu", "Ornn", "Sejuani", "Leona", "Nautilus", "Braum", "Alistar", "Tahm Kench", "Zac", "Rammus", "Cho'Gath", "Sion", "Maokai", "Poppy", "Shen", "K'Sante", "Rell", "Taric", "Dr. Mundo"];
    if (tanques.includes(nombre)) return buildsData.tanque;;
    const asesinos = ["Zed", "Talon", "Katarina", "Akali", "Qiyana", "Kha'Zix", "Rengar", "Nocturne", "Shaco", "Ekko", "Fizz", "Naafiri", "Diana", "Elise", "Evelynn", "LeBlanc"];
    if (asesinos.includes(nombre)) return buildsData.asesino;;
    const soportes = ["Thresh", "Lulu", "Janna", "Soraka", "Sona", "Nami", "Yuumi", "Milio", "Bard", "Karma", "Morgana", "Blitzcrank", "Pyke", "Seraphine", "Renata Glasc", "Rakan", "Zilean", "Ivern"];
    if (soportes.includes(nombre)) return buildsData.soporte;;
    const magos = ["Ahri", "Lux", "Syndra", "Orianna", "Viktor", "Veigar", "Ziggs", "Xerath", "Brand", "Vel'Koz", "Anivia", "Annie", "Cassiopeia", "Ryze", "Swain", "Heimerdinger", "Aurelion Sol", "Aurora", "Azir", "Fiddlesticks", "Karthus", "Kassadin", "Kennen", "Lissandra", "Malzahar", "Neeko", "Nidalee", "Rumble", "Taliyah", "Twisted Fate", "Vex", "Vladimir", "Zoe", "Zyra", "Hwei", "Sylas"];
    if (magos.includes(nombre)) return buildsData.mago;
    return buildsData.luchador;
}

async function inicializarDatos() {
    try {
        const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionRes.json();
        const latestVersion = versions[0];

        const champsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/es_MX/champion.json`);
        const champsJson = await champsRes.json();
        championsData = champsJson.data;
        const buildsRes = await fetch("data/builds.json");
buildsData = await buildsRes.json();

        const selectElement = document.getElementById('champion');
        selectElement.innerHTML = '';

        const nombresOrdenados = Object.keys(championsData).sort();
        nombresOrdenados.forEach(key => {
            const champ = championsData[key];
            const option = document.createElement('option');
            option.value = champ.id;
            option.textContent = champ.name;
            if (champ.id === "MissFortune") option.selected = true;
            selectElement.appendChild(option);
        });

        selectElement.disabled = false;
        document.getElementById('btnAnalizar').disabled = false;
        document.getElementById('loadingStatus').textContent = `Base de datos sincronizada correctamente (Parche ${latestVersion} - es_MX).`;
        document.getElementById('loadingStatus').style.color = "#34d399";

    } catch (error) {
        console.error("Error al conectar con Data Dragon:", error);
        document.getElementById('loadingStatus').textContent = "Error al conectar con la base de datos oficial. Verifica tu conexión.";
        document.getElementById('loadingStatus').style.color = "#f87171";
    }
}

document.getElementById('btnAnalizar').addEventListener('click', function() {
    const summoner = document.getElementById('summoner').value.trim() || "Invocador#LAS";
    const champKey = document.getElementById('champion').value;
    const champInfo = championsData[champKey];
    const resultadoDiv = document.getElementById('resultado');

    let perfil = obtenerPerfilCampeon(champInfo.name);

    document.getElementById('resTitulo').textContent = `${champInfo.name} — ${champInfo.title}`;
    document.getElementById('resClaseBadge').textContent = `Clases: ${perfil.clase}`;
    document.getElementById('resInvocadorBadge').textContent = `Invocador: ${summoner}`;
    document.getElementById('resEstrategia').innerHTML = `<strong>Estilo de Combate:</strong> ${perfil.estilo}<br><br><strong>Objetivo Principal:</strong> ${perfil.objetivo}`;
    document.getElementById('resSinergia').innerHTML = perfil.sinergia;
    document.getElementById('resFarm').innerHTML = `<strong>Minuto 10:</strong> ${perfil.farm10}<br><strong>Minuto 20:</strong> ${perfil.farm20}`;
    document.getElementById('resSubtext').textContent = perfil.farmSub;

    document.getElementById('resStart').innerHTML = perfil.inicio.map(nombreItem => `<li>${nombreItem}</li>`).join('');
    document.getElementById('resCore').innerHTML = perfil.core.map(nombreItem => `<li>${nombreItem}</li>`).join('');
    document.getElementById('resSituacional').innerHTML = perfil.situacionales.map(item => `<span class="tag">${item}</span>`).join('');

    document.getElementById('resConsejo').textContent = perfil.consejo;

    resultadoDiv.style.display = 'block';
});

window.onload = inicializarDatos;
