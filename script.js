// --- LOGIKA JAM ---
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- LOGIKA TODO LIST ---
const todoListElement = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo');
let todos = JSON.parse(localStorage.getItem('dashboard_todos')) || [];

function saveTodos() { localStorage.setItem('dashboard_todos', JSON.stringify(todos)); }

function renderTodos() {
    todoListElement.innerHTML = ''; 
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            todos[index].completed = !todos[index].completed;
            saveTodos(); renderTodos();
        });

        const span = document.createElement('span');
        span.textContent = todo.text;
        span.className = 'todo-text';
        if (todo.completed) span.classList.add('completed');

        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos(); renderTodos();
        });

        li.appendChild(checkbox); li.appendChild(span); li.appendChild(deleteBtn);
        todoListElement.appendChild(li);
    });
}

newTodoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
        todos.push({ text: this.value.trim(), completed: false });
        this.value = ''; saveTodos(); renderTodos();
    }
});
renderTodos();

// --- LOGIKA CUACA ---
function fetchWeather(lat, lon) {
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`)
        .then(res => res.json())
        .then(data => { document.getElementById('location').textContent = data.city || data.locality || data.countryName; })
        .catch(() => document.getElementById('location').textContent = "Lokasi Ditemukan");

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
            const weather = data.current_weather;
            document.getElementById('temp').textContent = `${Math.round(weather.temperature)}°C`;
            const code = weather.weathercode;
            let condition = "Tidak diketahui";
            if (code === 0) condition = "Cerah";
            else if (code >= 1 && code <= 3) condition = "Berawan";
            else if (code >= 45 && code <= 48) condition = "Berkabut";
            else if (code >= 51 && code <= 67) condition = "Hujan Ringan";
            else if (code >= 71 && code <= 77) condition = "Bersalju";
            else if (code >= 80 && code <= 82) condition = "Hujan Deras";
            else if (code >= 95) condition = "Badai Petir";
            document.getElementById('condition').textContent = condition;
        }).catch(() => document.getElementById('condition').textContent = "Gagal memuat cuaca");
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
        () => { document.getElementById('location').textContent = "Izin Ditolak"; }
    );
}

// --- LOGIKA RANDOM QUOTES DARI API ---
function fetchRandomQuote() {
    fetch('https://dummyjson.com/quotes/random')
        .then(response => response.json())
        .then(data => {
            document.getElementById('quote').textContent = `"${data.quote}"`;
            document.getElementById('author').textContent = `- ${data.author}`;
        })
        .catch(error => {
            document.getElementById('quote').textContent = `"When you give up, that's when the game ends."`;
            document.getElementById('author').textContent = `- Mitsuyoshi Anzai (Slam Dunk)`;
        });
}
fetchRandomQuote();

// --- LOGIKA RANDOM VIDEO BACKGROUND ---
function setRandomVideo() {
    // Gunakan nama file lokal (pastikan file MP4 ini sudah Anda kompres
    // dan diletakkan di dalam folder ekstensi yang sama)
    const videos = [
        "https://files.catbox.moe/22nuwp.mp4",
        "https://files.catbox.moe/q6wr52.mp4",
        "https://www.dropbox.com/scl/fi/tl65wkn3csu3gpp5z6d9j/kita-ikuyo-afternoon-maid-bocchi-the-rock-moewalls-com.mp4?rlkey=3k1ai6yytujyh6flb8m3v90z6&st=hcy40zvb&raw=1",
        "https://www.dropbox.com/scl/fi/irgilk3wu5uyqjrv3x6gw/black-cat-blue-sky-moewalls-com.mp4?rlkey=mimodn5zsj62kcbqnvfuw1yco&st=lsqvb7m7&raw=1",
        "https://www.dropbox.com/scl/fi/dqtjr7eko9vfgxihtjgfc/whales-sky-moewalls-com.mp4?rlkey=22dl8wjuwf8v2px45i7aur5ww&st=uib82kim&raw=1",
        "https://www.dropbox.com/scl/fi/t5mgj9c1rzdagrb5cb8x9/qingxiao-sky-break-wuthering-waves-moewalls-com.mp4?rlkey=tks5p19avvqday56qr6vgtla2&st=h7dtxszf&raw=1"
    ];
    
    /* 
    CATATAN: 
    Jika Anda meng-upload video ke Catbox.moe, ganti nama file di atas 
    dengan link lengkapnya, contoh: "https://files.catbox.moe/abcde.mp4"
    */
    
    const randomIndex = Math.floor(Math.random() * videos.length);
    const bgVideo = document.getElementById('bg-video');
    
    bgVideo.src = videos[randomIndex];
}

setRandomVideo();