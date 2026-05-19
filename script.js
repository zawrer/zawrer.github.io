// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Делаем все окна перетаскиваемыми
    const windows = document.querySelectorAll('.floating-window');
    windows.forEach(makeWindowDraggable);

    // 2. Запускаем часы в Waybar
    updateTime();
    setInterval(updateTime, 1000); // Обновлять каждую секунду
});

// --- ЧАСЫ (WAYBAR) ---
function updateTime() {
    const clockEl = document.getElementById('real-time');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU');
    clockEl.textContent = timeStr;
}

// --- УПРАВЛЕНИЕ ОКНАМИ (Закрыть/Максимизировать) ---
function closeWin(dotEl) {
    // Находим окно, к которому принадлежит точка, и скрываем его
    const window = dotEl.closest('.floating-window');
    window.style.display = 'none';
}

function maxWin(dotEl) {
    // Тогглим класс .maximized у окна
    const window = dotEl.closest('.floating-window');
    window.classList.toggle('maximized');
}

// --- КНОПКИ (WAYBAR ACTIONS) ---
function shutdownReq() {
    // Пример активной кнопки питания - выдает запрос на выключение
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    osc.type = 'sine'; osc.frequency.value = 300; osc.connect(context.destination);
    osc.start(); osc.stop(context.currentTime + 0.1);

    const confirmation = prompt("zawrer@cachyos: Запрос на выключение системы (Enter passphrase for root access):", "root_secret");
    if (confirmation) {
        alert('Система CachyOS Zawrer Rice переходит в режим сна. Сессия завершена.');
        document.body.style.opacity = '0.3';
    }
}

function switchWS(wsEl, wsNum) {
    // Простая имитация переключения воркспейсов - меняет активную кнопку
    const allWorkspaces = document.querySelectorAll('.workspaces .ws');
    allWorkspaces.forEach(ws => ws.classList.remove('active'));
    wsEl.classList.add('active');

    // Лог в консоль для проверки активной кнопки
    console.log(`Active Workspace changed to: ${wsNum}`);
}

// --- DRAG-N-DROP ДЛЯ ОКОН (Логика перемещения) ---
function makeWindowDraggable(win) {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offset = [0,0];

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        
        // При клике на окно поднимаем его z-index выше всех остальных
        document.querySelectorAll('.floating-window').forEach(w => w.style.zIndex = '10');
        win.style.zIndex = '50'; // Фокус на текущем окне

        offset = [
            win.offsetLeft - e.clientX,
            win.offsetTop - e.clientY
        ];
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            // Вычисляем новые координаты с учетом оффсета
            win.style.left = (e.clientX + offset[0]) + 'px';
            win.style.top = (e.clientY + offset[1]) + 'px';
        }
    });
}
