// --- ТРЕКИ ДЛЯ ПЛЕЕРА ---
const playlist = [
    { title: "The Night We Met", artist: "Lord Huron", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "CachyOS Cyberpunk", artist: "Synthwave Rice", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Hyprland Horizon", artist: "Arch Ambient", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();
let currentWorkspace = 1;

document.addEventListener('DOMContentLoaded', () => {
    const windows = document.querySelectorAll('.floating-window');
    windows.forEach(makeWindowDraggable);

    // Часы
    updateTime();
    setInterval(updateTime, 1000);

    // Инициализация плеера
    initPlayer();

    // Инициализация терминала
    initTerminal();

    // Запуск начального воркспейса
    updateWorkspaceView();
});

// --- ЧАСЫ ---
function updateTime() {
    const clockEl = document.getElementById('real-time');
    if(clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('ru-RU');
    }
}

// --- УПРАВЛЕНИЕ ОКНАМИ ---
function closeWin(dotEl) {
    const win = dotEl.closest('.floating-window');
    win.style.display = 'none';
}

function minimizeWin(dotEl) {
    const win = dotEl.closest('.floating-window');
    win.style.opacity = win.style.opacity === '0.2' ? '1' : '0.2';
}

function maxWin(dotEl) {
    const win = dotEl.closest('.floating-window');
    win.classList.toggle('maximized');
}

// --- ВОРКСПЕЙСЫ (ТАБЫ) ---
function switchWS(wsEl, wsNum) {
    document.querySelectorAll('.workspaces .ws').forEach(ws => ws.classList.remove('active'));
    wsEl.classList.add('active');
    currentWorkspace = wsNum;
    updateWorkspaceView();
}

function updateWorkspaceView() {
    document.querySelectorAll('.floating-window').forEach(win => {
        if (parseInt(win.getAttribute('data-ws')) === currentWorkspace) {
            win.style.visibility = 'visible';
            win.style.pointerEvents = 'auto';
        } else {
            win.style.visibility = 'hidden';
            win.style.pointerEvents = 'none';
        }
    });
    document.getElementById('waybar-title').textContent = `CachyOS Ricing - Workspace [${currentWorkspace}]`;
}

// --- ПЕРЕТАСКИВАНИЕ И ФОКУСИРОВКА ---
function makeWindowDraggable(win) {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offset = [0,0];

    // Клик для фокуса
    win.addEventListener('mousedown', () => {
        document.querySelectorAll('.floating-window').forEach(w => w.style.zIndex = '10');
        win.style.zIndex = '50';
    });

    header.addEventListener('mousedown', (e) => {
        if(e.target.tagName === 'SPAN') return; // Не тащить при клике на кнопки
        isDragging = true;
        offset = [ win.offsetLeft - e.clientX, win.offsetTop - e.clientY ];
    });

    document.addEventListener('mouseup', () => isDragging = false);

    document.addEventListener('mousemove', (e) => {
        if (isDragging && !win.classList.contains('maximized')) {
            e.preventDefault();
            win.style.left = (e.clientX + offset[0]) + 'px';
            win.style.top = (e.clientY + offset[1]) + 'px';
        }
    });
}

// --- МУЗЫКАЛЬНЫЙ ПЛЕЕР (ncmpcpp) ---
function initPlayer() {
    const playlistEl = document.getElementById('playlist-entries');
    playlistEl.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${track.artist} - ${track.title}`;
        li.onclick = () => loadAndPlayTrack(index);
        li.setAttribute('id', `track-${index}`);
        playlistEl.appendChild(li);
    });

    loadTrack(currentTrackIndex);

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progress-bar').style.width = `${progress || 0}%`;
        
        // Форматирование времени
        const curMin = Math.floor(audio.currentTime / 60);
        const curSec = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        const durMin = Math.floor(audio.duration / 60) || 0;
        const durSec = Math.floor(audio.duration % 60).toString().padStart(2, '0');
        document.getElementById('player-time').textContent = `${curMin}:${curSec} / ${durMin}:${durSec}`;
    });

    audio.addEventListener('ended', () => nextTrack());
}

function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = playlist[index].url;
    document.getElementById('player-artist').textContent = playlist[index].artist;
    document.getElementById('player-title').textContent = playlist[index].title;
    
    document.querySelectorAll('.playlist li').forEach(li => li.classList.remove('active-track'));
    const activeEntry = document.getElementById(`track-${index}`);
    if(activeEntry) activeEntry.classList.add('active-track');
}

function loadAndPlayTrack(index) {
    loadTrack(index);
    play();
}

function togglePlay() {
    if (isPlaying) { playPause(); } else { play(); }
}

function play() {
    isPlaying = true;
    audio.play().catch(e => console.log("Музыка заблокирована браузером. Нажмите Play вручную."));
    document.getElementById('play-btn').innerHTML = '<i class="fas fa-pause"></i>';
}

function playPause() {
    isPlaying = false;
    audio.pause();
    document.getElementById('play-btn').innerHTML = '<i class="fas fa-play"></i>';
}

function nextTrack() {
    let next = (currentTrackIndex + 1) % playlist.length;
    loadAndPlayTrack(next);
}

function prevTrack() {
    let prev = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadAndPlayTrack(prev);
}

// --- СИМУЛЯТОР ТЕРМИНАЛА ---
function initTerminal() {
    const input = document.getElementById('terminal-input');
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                handleCommand(command);
                input.value = '';
            }
        }
    });

    // Удержание фокуса на вводе при клике на терминал
    document.getElementById('terminal-screen').addEventListener('click', () => {
        input.focus();
    });
}

function handleCommand(cmdStr) {
    const output = document.getElementById('terminal-output');
    const lowerCmd = cmdStr.toLowerCase().split(' ')[0];
    let response = '';

    if (lowerCmd === 'clear') {
        output.innerHTML = '';
        return;
    }

    switch(lowerCmd) {
        case 'help':
            response = `Доступные команды:<br>
            <b>help</b> - показать этот список<br>
            <b>ls</b> - список файлов директории<br>
            <b>fetch</b> - запустить fastfetch<br>
            <b>cat notes.md</b> - прочитать файл заметок<br>
            <b>matrix</b> - симуляция матрицы в консоли<br>
            <b>ping</b> - проверить пинг до zawrer_lan<br>
            <b>clear</b> - очистить экран`;
            break;
        case 'ls':
            response = `<span class="directory">core/</span>  <span class="directory">stack/</span>  <span class="key">notes.md</span>  site_config.json`;
            break;
        case 'fetch':
            document.getElementById('fastfetch-view').style.display = 'flex';
            response = 'Fastfetch успешно выполнен.';
            break;
        case 'cat':
            if(cmdStr.toLowerCase().includes('notes.md')) {
                response = `### ЗАМЕТКИ ZAWRER<br>- Настроить конфигурацию Hyprland<br>- Дописать кастомный плеер для гитхаб страниц<br>- Собрать ядро Linux-CachyOS с оптимизациями`;
            } else {
                response = 'Использование: cat [имя_файла] (попробуйте "cat notes.md")';
            }
            break;
        case 'matrix':
            response = `<span class="green">0101010101010101010101010101010101010101010101<br>
            1010101010101100101010101010101010101010101010<br>
            000101010101010110101011 zawrer_system_accessed 10<br>
            1010101010101010101010101010101010101010101010</span>`;
            break;
        case 'ping':
            response = `PING zawrer_lan (192.168.1.50) 56(84) bytes of data.<br>
            64 bytes from 192.168.1.50: icmp_seq=1 ttl=64 time=0.231 ms<br>
            64 bytes from 192.168.1.50: icmp_seq=2 ttl=64 time=0.189 ms<br>
            --- zawrer_lan ping statistics --- 2 packets transmitted, 0% packet loss`;
            break;
        default:
            response = `zsh: команда не найдена: ${cmdStr}. Напишите 'help' для справки.`;
    }

    output.innerHTML += `<div class="history-item"><span class="prompt">zawrer@cachyos:~$</span> ${cmdStr}</div>`;
    output.innerHTML += `<div class="response-item">${response}</div>`;
    
    // Скролл вниз
    const screen = document.getElementById('terminal-screen');
    screen.scrollTop = screen.scrollHeight;
}

// Кнопка выключения в Waybar
function shutdownReq() {
    const confirmation = prompt("zawrer@cachyos: Запрос на выключение системы (Enter passphrase for root access):", "root_secret");
    if (confirmation === "root_secret" || confirmation === "") {
        alert('Система CachyOS Zawrer Rice переходит в режим сна. Сессия завершена.');
        document.body.style.opacity = '0.1';
    }
}
