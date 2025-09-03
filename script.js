const initialData = [
    {
        "nome": "Andressa Alves",
        "posicao": "Meio-campo",
        "clube": "Corinthians",
        "foto": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.ogol.com.br%2Fwimg%2Fn722121b%2Fandressa-alves-volta-ao-brasil-e-assina-pelo-corinthians-rea.jpg&f=1&nofb=1&ipt=019dfd1c5d03238ba1226873881bf6f0abcdbb37714b2590f50e6342c8b36ccc",
        "gols": 15,
        "assistencias": 10,
        "jogos": 28,
        "favorita": false
    },
    {
        "nome": "Dayana Rodríguez",
        "posicao": "Meio-campo",
        "clube": "Corinthians",
        "foto": "https://cdn-img.zerozero.pt/img/jogadores/new/17/86/531786_dayana_rodriguez_20250418230620.png",
        "gols": 5,
        "assistencias": 12,
        "jogos": 30,
        "favorita": false
    },
    {
        "nome": "Mariza",
        "posicao": "Zagueira",
        "clube": "Corinthians",
        "foto": "https://cdn-img.zerozero.pt/img/jogadores/new/64/05/526405_mariza_20250723194000.png",
        "gols": 2,
        "assistencias": 1,
        "jogos": 32,
        "favorita": false
    },
    {
        "nome": "Thaís Regina",
        "posicao": "Zagueira",
        "clube": "Corinthians",
        "foto": "https://cdn-img.zerozero.pt/img/jogadores/new/31/21/433121_thais_regina_20250418225717.png",
        "gols": 1,
        "assistencias": 2,
        "jogos": 25,
        "favorita": false
    },
    {
        "nome": "Letícia Teles",
        "posicao": "Zagueira",
        "clube": "Corinthians",
        "foto": "https://cdn-img.zerozero.pt/img/jogadores/new/01/43/710143_leticia_teles_20250418225602.png",
        "gols": 0,
        "assistencias": 0,
        "jogos": 18,
        "favorita": false
    }
];

let players = [];
let editingIndex = null;
let showingFavoritesOnly = false;

// Inicialização
function init() {
    if (!localStorage.getItem('players')) {
        localStorage.setItem('players', JSON.stringify(initialData));
    }
    loadPlayers();
    setupEventListeners();
    updateTeamFilter();
    updateStatsSummary();
}

// Carregar jogadoras do localStorage
function loadPlayers() {
    players = JSON.parse(localStorage.getItem('players')) || [];
    renderPlayers();
}

// Salvar jogadoras no localStorage
function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
    updateTeamFilter();
    updateStatsSummary();
}

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterPlayers);
    document.getElementById('teamFilter').addEventListener('change', filterPlayers);
}

// Atualizar resumo de estatísticas
function updateStatsSummary() {
    const totalPlayers = players.length;
    const totalGoals = players.reduce((sum, p) => sum + (p.gols || 0), 0);
    const totalAssists = players.reduce((sum, p) => sum + (p.assistencias || 0), 0);
    const totalFavorites = players.filter(p => p.favorita).length;

    document.getElementById('totalPlayers').textContent = totalPlayers;
    document.getElementById('totalGoals').textContent = totalGoals;
    document.getElementById('totalAssists').textContent = totalAssists;
    document.getElementById('totalFavorites').textContent = totalFavorites;
}

// Renderizar jogadoras
function renderPlayers(playersToRender = players) {
    const grid = document.getElementById('playersGrid');
    const emptyState = document.getElementById('emptyState');

    if (playersToRender.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = playersToRender.map((player) => {
        const realIndex = players.indexOf(player);
        return `
                    <div class="player-card">
                        <div class="player-image">
                            ${player.foto ? `<img src="${player.foto}" alt="${player.nome}" style="width: 100%; height: 100%; object-fit: cover;">` : '👤'}
                            <button class="favorite-btn ${player.favorita ? 'active' : ''}" onclick="toggleFavorite(${realIndex})">
                                ${player.favorita ? '⭐' : '☆'}
                            </button>
                        </div>
                        <div class="player-info">
                            <div class="player-name">${player.nome}</div>
                            <div class="player-details">
                                <div> ${player.posicao}</div>
                                <div> ${player.clube}</div>
                            </div>
                            <div class="player-stats">
                                <div class="stat">
                                    <span class="stat-value">${player.gols || 0}</span>
                                    <span class="stat-label">Gols</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value">${player.assistencias || 0}</span>
                                    <span class="stat-label">Assists</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value">${player.jogos || 0}</span>
                                    <span class="stat-label">Jogos</span>
                                </div>
                            </div>
                            <div class="card-actions">
                                <button class="btn btn-secondary" onclick="openEditModal(${realIndex})">✏️ Editar</button>
                                <button class="btn btn-danger" onclick="deletePlayer(${realIndex})">🗑️ Excluir</button>
                            </div>
                        </div>
                    </div>
                `;
    }).join('');
}

// Toggle favorito
function toggleFavorite(index) {
    players[index].favorita = !players[index].favorita;
    savePlayers();
    filterPlayers();
}

// Filtrar jogadoras
function filterPlayers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const teamFilter = document.getElementById('teamFilter').value;

    let filtered = players;

    if (showingFavoritesOnly) {
        filtered = filtered.filter(p => p.favorita);
    }

    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.nome.toLowerCase().includes(searchTerm) ||
            p.posicao.toLowerCase().includes(searchTerm)
        );
    }

    if (teamFilter) {
        filtered = filtered.filter(p => p.clube === teamFilter);
    }

    renderPlayers(filtered);
}

// Mostrar apenas favoritas
function showFavoritesOnly() {
    showingFavoritesOnly = !showingFavoritesOnly;
    filterPlayers();

    const btn = event.target;
    if (showingFavoritesOnly) {
        btn.classList.remove('btn-warning');
        btn.classList.add('btn-success');
    } else {
        btn.classList.remove('btn-success');
        btn.classList.add('btn-warning');
    }
}

// Ordenar jogadoras
function sortPlayers(field) {
    const sorted = [...players].sort((a, b) => {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
    });
    renderPlayers(sorted);
}

// Atualizar filtro de times
function updateTeamFilter() {
    const teams = [...new Set(players.map(p => p.clube))].sort();
    const select = document.getElementById('teamFilter');
    const currentValue = select.value;

    select.innerHTML = '<option value="">Todos os times</option>';
    teams.forEach(team => {
        select.innerHTML += `<option value="${team}">${team}</option>`;
    });

    select.value = currentValue;
}

// Abrir modal de adicionar
function openAddModal() {
    editingIndex = null;
    document.getElementById('modalTitle').textContent = 'Adicionar Jogadora';
    document.getElementById('playerForm').reset();
    document.getElementById('playerModal').classList.add('active');
}

// Abrir modal de editar
function openEditModal(index) {
    editingIndex = index;
    const player = players[index];

    document.getElementById('modalTitle').textContent = 'Editar Jogadora';
    document.getElementById('playerName').value = player.nome;
    document.getElementById('playerPosition').value = player.posicao;
    document.getElementById('playerClub').value = player.clube;
    document.getElementById('playerPhoto').value = player.foto || '';
    document.getElementById('playerGoals').value = player.gols || 0;
    document.getElementById('playerAssists').value = player.assistencias || 0;
    document.getElementById('playerGames').value = player.jogos || 0;

    document.getElementById('playerModal').classList.add('active');
}

// Fechar modal
function closeModal() {
    document.getElementById('playerModal').classList.remove('active');
    document.getElementById('playerForm').reset();
}

// Salvar jogadora
function savePlayer(event) {
    event.preventDefault();

    const player = {
        nome: document.getElementById('playerName').value,
        posicao: document.getElementById('playerPosition').value,
        clube: document.getElementById('playerClub').value,
        foto: document.getElementById('playerPhoto').value,
        gols: parseInt(document.getElementById('playerGoals').value) || 0,
        assistencias: parseInt(document.getElementById('playerAssists').value) || 0,
        jogos: parseInt(document.getElementById('playerGames').value) || 0,
        favorita: editingIndex !== null ? players[editingIndex].favorita : false
    };

    if (editingIndex !== null) {
        players[editingIndex] = player;
        alert('Jogadora editada com sucesso!');
    } else {
        players.push(player);
        alert('Jogadora adicionada com sucesso!');
    }

    savePlayers();
    filterPlayers();
    closeModal();
}

// Deletar jogadora
function deletePlayer(index) {
    if (confirm(`Tem certeza que deseja excluir ${players[index].nome}?`)) {
        players.splice(index, 1);
        savePlayers();
        filterPlayers();
        alert('Jogadora removida com sucesso!');
    }
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', init);