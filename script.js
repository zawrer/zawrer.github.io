const nickname = "zawrer";
const infoAboutMe = `Привет! Я программист. Специализируюсь на системной и низкоуровневой разработке.\nИзучаемые языки: C, C++, Python, JS.\nВ данный момент активно углубляюсь в Кибербезопасность (Cybersecurity & InfoSec).`;

const bootLogs = [
    ":: Synchronizing package databases...",
    ":: Starting full system upgrade...",
    "loading packages...",
    "resolving dependencies...",
    "looking for conflicting packages...",
    "Initializing Hyprland wm manager version 0.40.0...",
    "[ OK ] Found Graphics Card: NVIDIA GeForce RTX / AMD Ryzen",
    "[ OK ] Loaded Wayland Display Server Successfully.",
    "[ INFO ] Welcome back, master " + nickname + "!",
    "Boot finished. Launching environment..."
];

// Локальные обои из папки проекта image/
// Динамическая генерация случайных обоев из интернета (Unsplash API)
function getRandomWallpaperUrl() {
    // Ключевые слова для поиска подходящего бэкграунда
    const keywords = "cyberpunk,dark,abstract,minimalism";
    // Уникальная сигнатура (timestamp) заставляет браузер загружать каждый раз новую картинку
    const uniqueSignature = Date.now(); 
    
    return `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://source.unsplash.com/featured/1920x1080/?${keywords}&sig=${uniqueSignature}')`;
}

// Начальные обои при загрузке страницы
let currentWallpaper = "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920')";
let currentWallpaperIdx = 0;

// Плейлист музыкального плеера
const playlist = [
    {
        title: "Cyberpunk Ambient Track",
        author: "zawrer Lofi Beats",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        icon: "fa-compact-disc"
    },
    {
        title: "Neon Outrun Drive",
        author: "Retro Synthwave",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        icon: "fa-bolt"
    },
    {
        title: "Kernel Panic Meltdown",
        author: "Glitch Hop Engine",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        icon: "fa-microchip"
    }
];
let currentTrackIdx = 0;

const fastfetchOutput = `
<span style="color:#7f7f7f">       /\\       </span>   <span style="color: #fff"><b>${nickname}</b>@arch-portfolio</span>
<span style="color:#7f7f7f">      /  \\      </span>   -------------------------
<span style="color:#7f7f7f">     /\\   \\     </span>   <b>OS</b>: Arch Linux x86_64
<span style="color:#7f7f7f">    /  __  \\    </span>   <b>WM</b>: Hyprland (Tiling)
<span style="color:#7f7f7f">   /  (  )  \\   </span>   <b>Shell</b>: bash 5.2-web
<span style="color:#7f7f7f">  /  ______  \\  </span>   <b>Languages</b>: C, C++, Python, JS
<span style="color:#7f7f7f"> /_ /      \\ _\\ </span>   <b>Focus</b>: Cybersecurity / Reverse Eng
`;

document.addEventListener("DOMContentLoaded", () => {
    const bootScreen = document.getElementById("boot-screen");
    const bootLogContainer = document.getElementById("boot-log");
    const desktop = document.getElementById("desktop");
    
    let logIndex = 0;
    
    function printLog() {
        if (bootLogContainer && logIndex < bootLogs.length) {
            const p = document.createElement("p");
            p.textContent = bootLogs[logIndex];
            bootLogContainer.appendChild(p);
            logIndex++;
            setTimeout(printLog, Math.random() * 80 + 30);
        } else {
            setTimeout(() => {
                if (bootScreen) bootScreen.classList.add("hidden");
                if (desktop) desktop.classList.remove("hidden");
                
                initTerminalSystem();
                startClockSystem();
                initWindowManager();
                initAudioPlayerSystem();
            }, 500);
        }
    }
    
    if (bootLogContainer) {
        printLog();
    } else {
        if (bootScreen) bootScreen.classList.add("hidden");
        if (desktop) desktop.classList.remove("hidden");
        initTerminalSystem();
        startClockSystem();
        initWindowManager();
        initAudioPlayerSystem();
    }
});

function startClockSystem() {
    const timeEl = document.getElementById("bar-time");
    if (!timeEl) return;
    setInterval(() => {
        const now = new Date();
        timeEl.innerHTML = `<i class="far fa-clock"></i> ${now.toTimeString().split(' ')[0]}`;
    }, 1000);
}

let termOutput, termInput;

function initTerminalSystem() {
    termOutput = document.getElementById("terminal-output");
    termInput = document.getElementById("terminal-input");
    
    if (termOutput) {
        termOutput.innerHTML = `<pre>${fastfetchOutput}</pre><br><p>Введите 'help' для просмотра команд.</p><br>`;
    }
    
    if (termInput) {
        termInput.focus();
        termInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const cmd = termInput.value.trim().toLowerCase();
                termInput.value = "";
                
                if (termOutput) {
                    termOutput.innerHTML += `<div class="input-line"><span class="prompt">zawrer@arch ~ $</span><span>${escapeHtml(cmd)}</span></div>`;
                    handleTerminalCommand(cmd);
                    const termBody = document.getElementById("term-body");
                    if (termBody) termBody.scrollTop = termBody.scrollHeight;
                }
            }
        });
    }
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function handleTerminalCommand(cmd) {
    let reply = "";
    if (cmd === "") return;
    
    switch(cmd) {
        case "help":
            reply = "<p>Доступные команды: <b>about</b>, <b>fastfetch</b>, <b>skills</b>, <b>clear</b>, <b>sudo</b>, <b>cat-feed</b>, <b>cmatrix</b></p>";
            break;
        case "about":
            reply = `<p style="white-space: pre-line;">${infoAboutMe}</p>`;
            break;
        case "fastfetch":
        case "neofetch":
            reply = `<pre>${fastfetchOutput}</pre>`;
            break;
        case "skills":
            reply = "<p><b>System dev:</b> C, C++ (CMake, Makefile)<br><b>Automation:</b> Python, Bash<br><b>Web:</b> JavaScript (Vanilla DOM)<br><b>CyberSec:</b> Kali Linux ecosystem, Wireshark, Nmap</p>";
            break;
        case "clear":
            if (termOutput) termOutput.innerHTML = "";
            return;
        case "cat-feed":
            reply = "<p class='green-text'>[ OK ] Вы скормили рыбку коту. Кот сыто мурчит.</p>";
            const catStatus = document.getElementById("cat-status-text");
            if (catStatus) catStatus.textContent = "Status: Content and full of fish! (Happy)";
            break;
        case "cmatrix":
            reply = "<p class='green-text'>Запуск симуляции матрицы... Система стабильна.</p>";
            break;
        case "sudo":
            reply = "<p>[sudo] password for zawrer: <br><span style='color:var(--alert)'>Ошибка:</span> zawrer не входит в список sudoers. Данный инцидент будет зафиксирован!</p>";
            break;
        case "rm -rf /":
        case "rm -rf / --no-preserve-root":
            triggerSystemCrash();
            return;
        default:
            reply = `<p style="color: var(--alert)">bsh: команда не найдена: ${escapeHtml(cmd)}</p>`;
    }
    
    if (termOutput) {
        termOutput.innerHTML += `<div class="cmd-reply">${reply}</div><br>`;
    }
}

function triggerSystemCrash() {
    document.body.innerHTML = `<div style="background-color: #000; color: #ff3333; font-family: monospace; padding: 30px; height: 100vh; width: 100vw; font-size: 16px;">
        <p>*** KERNEL PANIC ***</p>
        <p>CRITICAL ERROR: Root directory wiped out by master zawrer.</p>
        <p>sys_call_table corrupted. Halting CPU.</p>
        <p>Rebooting web-machine in 3 seconds...</p>
    </div>`;
    setTimeout(() => { location.reload(); }, 3000);
}

// Модуль управления окнами (Фокус, Закрытие, Открытие через Waybar)
function initWindowManager() {
    const windows = document.querySelectorAll(".window");
    const currentWinBar = document.getElementById("current-window");
    const wallBtn = document.getElementById("wallpaper-btn");
    const barAppButtons = document.querySelectorAll(".bar-app-btn");

    // Обработка клика по окну для смены фокуса
    windows.forEach(win => {
        win.addEventListener("click", () => {
            if (win.classList.contains("hidden")) return;
            windows.forEach(w => w.classList.remove("focused"));
            win.classList.add("focused");
            
            if (currentWinBar) {
                const titleEl = win.querySelector(".window-title");
                if (titleEl) currentWinBar.textContent = titleEl.textContent.trim();
            }
        });

        // Функция закрытия окна при нажатии на крестик
        const closeBtn = win.querySelector(".close-btn");
        if (closeBtn) {
            closeBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // Исключаем фокус перед закрытием
                win.classList.add("hidden");
                win.classList.remove("focused");
                
                // Перенаправляем фокус на любое оставшееся открытое окно
                const remainingVisible = Array.from(windows).find(w => !w.classList.contains("hidden"));
                if (remainingVisible) {
                    remainingVisible.click();
                } else if (currentWinBar) {
                    currentWinBar.textContent = "desktop — idle";
                }
            });
        }
    });

    // Открытие окон заново через кнопки в Waybar
    barAppButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const win = document.getElementById(targetId);
            if (win) {
                win.classList.remove("hidden");
                win.click(); // Даем фокус
            }
        });
    });

if (wallBtn) {
        // Устанавливаем стартовые обои при инициализации
        document.body.style.backgroundImage = currentWallpaper;

        wallBtn.addEventListener("click", () => {
            // Меняем статус во Waybar на время загрузки
            const originalText = wallBtn.innerHTML;
            wallBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;

            // Создаем временный объект изображения для предзагрузки в кэш
            const img = new Image();
            const newWallpaperUrl = getRandomWallpaperUrl();
            
            // Вытягиваем чистый URL из нашей строки с градиентом
            const cleanUrl = newWallpaperUrl.match(/url\('(.*)'\)/)[1];

            img.onload = () => {
                // Как только картинка скачалась, плавно меняем фон
                document.body.style.backgroundImage = newWallpaperUrl;
                wallBtn.innerHTML = originalText;
            };

            img.onerror = () => {
                // Если интернета нет или API лег, сбрасываем на дефолтный темный цвет
                document.body.style.backgroundImage = "none";
                document.body.style.backgroundColor = "#0b0b0b";
                wallBtn.innerHTML = originalText;
            };

            img.src = cleanUrl;
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === 'q') {
            e.preventDefault();
            const activeWin = document.querySelector(".window.focused");
            if (activeWin) {
                const cBtn = activeWin.querySelector(".close-btn");
                if (cBtn) cBtn.click();
            }
        }
        if (e.altKey && e.key === 'Enter') {
            e.preventDefault();
            const termWin = document.getElementById("win-terminal");
            if (termWin) {
                termWin.classList.remove("hidden");
                termWin.click();
                if (termInput) termInput.focus();
            }
        }
    });
}

// Модуль расширенного плеера (Play, Pause, Next, Prev, Playlist)
function initAudioPlayerSystem() {
    const audio = document.getElementById("audio-player");
    const playBtn = document.getElementById("play-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const progressBar = document.getElementById("progress");
    const playerWin = document.getElementById("win-player");
    
    const trackTitle = document.getElementById("track-title");
    const trackAuthor = document.getElementById("track-author");
    const iconContainer = document.getElementById("player-icon-container");

    if (!audio || !playBtn || !progressBar || !prevBtn || !nextBtn) return;

    // Загрузка метаданных текущего трека
    function loadTrack(idx) {
        const track = playlist[idx];
        audio.src = track.url;
        if (trackTitle) trackTitle.textContent = track.title;
        if (trackAuthor) trackAuthor.textContent = track.author;
        
        if (iconContainer) {
            iconContainer.innerHTML = `<i class="fas ${track.icon} fa-spin-slow"></i>`;
        }
        progressBar.style.width = "0%";
    }

    function playTrack() {
        audio.play().then(() => {
            playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
            if (playerWin) playerWin.querySelector(".window-status").textContent = "playing";
        }).catch(err => {
            console.log("Audio activation blocked by CORS/User interaction policy", err);
        });
    }

    function pauseTrack() {
        audio.pause();
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
        if (playerWin) playerWin.querySelector(".window-status").textContent = "paused";
    }

    // Инициализация первого трека при загрузке системы
    loadTrack(currentTrackIdx);

    playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (audio.paused) {
            playTrack();
        } else {
            pauseTrack();
        }
    });

    nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
        const wasPlaying = !audio.paused;
        loadTrack(currentTrackIdx);
        if (wasPlaying) playTrack();
    });

    prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentTrackIdx = (currentTrackIdx - 1 + playlist.length) % playlist.length;
        const wasPlaying = !audio.paused;
        loadTrack(currentTrackIdx);
        if (wasPlaying) playTrack();
    });

    // Автоматический переход на следующий трек по окончании текущего
    audio.addEventListener("ended", () => {
        currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
        loadTrack(currentTrackIdx);
        playTrack();
    });

    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = percent + "%";
        }
    });
}
