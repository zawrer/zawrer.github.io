// ДАННЫЕ О ПОЛЬЗОВАТЕЛЕ
const nickname = "zawrer";
const infoAboutMe = `Привет! Я программист. Специализируюсь на системной и низкоуровневой разработке.\nИзучаемые языки: C, C++, Python, JS.\nВ данный момент активно углубляюсь в Кибербезопасность (Cybersecurity & InfoSec).`;

// Логи инициализации Arch Linux
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

// Набор Обоев (монохромные заглушки, меняют фон body)
const wallpapers = [
    "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920')",
    "linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920')",
    "#0b0b0b" // Чистый дефолтный темный фон
];
let currentWallpaperIdx = 0;

// АНАЛОГ FASTFETCH / NEOFETCH
const fastfetchOutput = `
<span style="color:#7f7f7f">       /\\       </span>   <span style="color: #fff"><b>${nickname}</b>@arch-portfolio</span>
<span style="color:#7f7f7f">      /  \\      </span>   -------------------------
<span style="color:#7f7f7f">     /\\   \\     </span>   <b>OS</b>: Arch Linux x86_64
<span style="color:#7f7f7f">    /  __  \\    </span>   <b>WM</b>: Hyprland (Tiling)
<span style="color:#7f7f7f">   /  (  )  \\   </span>   <b>Shell</b>: bash 5.2-web
<span style="color:#7f7f7f">  /  ______  \\  </span>   <b>Languages</b>: C, C++, Python, JS
<span style="color:#7f7f7f"> /_ /      \\ _\\ </span>   <b>Focus</b>: Cybersecurity / Reverse Eng
`;

// ЗАПУСК ИНИЦИАЛИЗАЦИИ
document.addEventListener("DOMContentLoaded", () => {
    const bootScreen = document.getElementById("boot-screen");
    const bootLogContainer = document.getElementById("boot-log");
    const desktop = document.getElementById("desktop");

    let logIndex = 0;
    
    function printLog() {
        if (logIndex < bootLogs.length) {
            const p = document.createElement("p");
            p.textContent = bootLogs[logIndex];
            bootLogContainer.appendChild(p);
            logIndex++;
            setTimeout(printLog, Math.random() * 250 + 100); // Симуляция разной скорости чтения диска
        } else {
            setTimeout(() => {
                bootScreen.classList.add("hidden");
                desktop.classList.remove("hidden");
                initTerminal(); // Загружаем консоль
                startClock();    // Запускаем время
            }, 800);
        }
    }
    printLog();
});

// ЧАСЫ ДЛЯ WAYBAR
function startClock() {
    const timeEl = document.getElementById("bar-time");
    setInterval(() => {
        const now = new Date();
        timeEl.innerHTML = `<i class="far fa-clock"></i> ${now.toTimeString().split(' ')[0]}`;
    }, 1000);
}

// РАБОТА С ТЕРМИНАЛОМ
const termOutput = document.getElementById("terminal-output");
const termInput = document.getElementById("terminal-input");

function initTerminal() {
    termOutput.innerHTML = `<pre>${fastfetchOutput}</pre><br><p>Введите 'help' для просмотра команд.</p><br>`;
}

termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const cmd = termInput.value.trim().toLowerCase();
        termInput.value = "";
        
        // Выводим саму команду в историю
        termOutput.innerHTML += `<div class="input-line"><span class="prompt">zawrer@arch ~ $</span><span>${cmd}</span></div>`;
        
        handleCommand(cmd);
        // Скроллим терминал вниз
        document.getElementById("term-body").scrollTop = document.getElementById("term-body").scrollHeight;
    }
});

// ОБРАБОТЧИК КОМАНД TERMINAL (+ ПАСХАЛКИ)
function handleCommand(cmd) {
    let reply = "";
    
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
            reply = "<p><b>System dev:</b> C, C++ (CMake, Makefile, Pointer arithmetic, OOP)<br><b>Automation/Scripts:</b> Python, Bash<br><b>Web:</b> JavaScript (Vanila, Async/DOM)<br><b>CyberSec:</b> Kali Linux ecosystem, Wireshark, Nmap, Reverse engineering basics</p>";
            break;
        case "clear":
            termOutput.innerHTML = "";
            return;
        case "cat-feed":
            reply = "<p class='green-text'>[ OK ] Вы скормили рыбку коту. Кот сыто мурчит в своем окне.</p>";
            document.getElementById("cat-status-text").textContent = "Status: Content and full of fish! (Happy)";
            break;
        case "cmatrix":
            reply = "<p class='green-text'>Запуск симуляции... Ищи пасхалки в других местах Neo.</p>";
            break;
        case "sudo":
            reply = "<p>[sudo] password for zawrer: <br><span style='color:var(--alert)'>Ошибка:</span> zawrer не входит в список sudoers. Данный инцидент будет зафиксирован!</p>";
            break;
            
        // ЖЕСТКАЯ ПАСХАЛКА: КЕРНЕЛ ПАНИК ДЛЯ LINUX-ОИДОВ
        case "rm -rf /":
        case "rm -rf / --no-preserve-root":
            triggerKernelPanic();
            return;
            
        default:
            if (cmd === "") return;
            reply = `<p style="color: var(--alert)">bsh: команда не найдена: ${cmd}</p>`;
    }
    
    termOutput.innerHTML += `<div class="cmd-reply">${reply}</div><br>`;
}

// Пасхалка разрушения системы
function triggerKernelPanic() {
    const body = document.body;
    body.innerHTML = `<div style="background-color: #000; color: #ff3333; font-family: monospace; padding: 30px; height: 100vh; width: 100vw; font-size: 16px;">
        <p>*** KERNEL PANIC ***</p>
        <p>CRITICAL ERROR: Root directory wiped out by master zawrer.</p>
        <p>sys_call_table corrupted. Halting CPU.</p>
        <p>Rebooting web-machine in 5 seconds...</p>
    </div>`;
    setTimeout(() => {
        location.reload();
    }, 5000);
}

// ПЕРЕКЛЮЧЕНИЕ ОБОЕВ
document.getElementById("wallpaper-btn").addEventListener("click", () => {
    currentWallpaperIdx = (currentWallpaperIdx + 1) % wallpapers.length;
    document.body.style.backgroundImage = wallpapers[currentWallpaperIdx];
    if (wallpapers[currentWallpaperIdx].includes("url")) {
        document.body.style.backgroundColor = "transparent";
    } else {
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = wallpapers[currentWallpaperIdx];
    }
});

// КЛИК ДЛЯ ФОКУСИРОВКИ ОКНА (Имитация тайлинга Hyprland)
const windows = document.querySelectorAll(".window");
windows.forEach(win => {
    win.addEventListener("click", () => {
        windows.forEach(w => w.classList.remove("focused"));
        win.classList.add("focused");
        
        // Меняем имя активного окна в Waybar
        const title = win.querySelector(".window-title").textContent;
        document.getElementById("current-window").textContent = title;
    });
});

// РАБОТА МУЗЫКАЛЬНОГО ПЛЕЕРА
const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const progressBar = document.getElementById("progress");

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        document.getElementById("win-player").querySelector(".window-status").textContent = "playing";
    } else {
        audio.pause();
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
        document.getElementById("win-player").querySelector(".window-status").textContent = "paused";
    }
});

// Обновление прогресс-бара
audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percent + "%";
});

// ДОПОЛНИТЕЛЬНЫЕ ХОТКЕИ (Hyprland Вайб)
window.addEventListener("keydown", (e) => {
    // Если нажат Alt + Q — очистить консоль (Аналог закрытия)
    if (e.altKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        termOutput.innerHTML = "<p style='color: var(--accent)'>[Система сброшена хоткеем Alt+Q]</p><br>";
    }
    // Если нажат Alt + Enter — автоматически сфокусироваться на вводе терминала
    if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        termInput.focus();
        document.getElementById("win-terminal").click();
    }
});