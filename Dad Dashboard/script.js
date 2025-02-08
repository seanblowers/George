document.addEventListener('DOMContentLoaded', () => {
    // Weather
    async function loadWeather() {
        try {
            const response = await fetch('data/weather.json');
            const data = await response.json();
            
            // Current weather
            document.getElementById('current-weather').innerHTML = `
                <div class="weather-item">
                    <span class="weather-icon">${data.current.icon}</span>
                    <div>
                        <span>${data.current.temp}°C</span><br>
                        <span>${data.current.condition}</span>
                    </div>
                </div>
            `;

            // Forecast
            const forecastHtml = data.forecast.map(day => `
                <div class="weather-item">
                    <span class="weather-icon">${day.icon}</span>
                    <div>
                        <span>${day.day}</span><br>
                        <span>${day.temp}°C</span>
                    </div>
                </div>
            `).join('');
            document.getElementById('weather-forecast').innerHTML = forecastHtml;
        } catch (error) {
            console.error('Error loading weather:', error);
        }
    }

    // Photo Slideshow
    let currentPhotoIndex = 0;
    let slideInterval;
    const photos = ['photos/photo1.jpg', 'photos/photo2.jpg']; // Add more photos
    
    function showPhoto(index) {
        const photoElement = document.getElementById('current-photo');
        photoElement.style.opacity = 0;
        
        setTimeout(() => {
            photoElement.src = photos[index];
            photoElement.style.opacity = 1;
        }, 500);
    }

    function startSlideshow() {
        slideInterval = setInterval(() => {
            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
            showPhoto(currentPhotoIndex);
        }, 5000);
    }

    document.getElementById('next-photo').addEventListener('click', () => {
        clearInterval(slideInterval);
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        showPhoto(currentPhotoIndex);
        startSlideshow();
    });

    document.getElementById('prev-photo').addEventListener('click', () => {
        clearInterval(slideInterval);
        currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        showPhoto(currentPhotoIndex);
        startSlideshow();
    });

    // Church Streams
    async function loadStreams() {
        try {
            const response = await fetch('data/streams.json');
            const data = await response.json();
            const now = new Date();
            
            const isSunday = now.getDay() === 0;
            const streams = isSunday ? data.thisWeek : data.lastWeek;

            document.getElementById('stream-links').innerHTML = `
                <a href="${streams.traditional}" class="stream-link" target="_blank">Traditional Service</a>
                <a href="${streams.modern}" class="stream-link" target="_blank">Modern Service</a>
            `;
        } catch (error) {
            console.error('Error loading streams:', error);
        }
    }

    // Today's Events
    async function loadEvents() {
        try {
            const response = await fetch('data/events.json');
            const events = await response.json();
            const now = new Date();
            
            const eventsHtml = events.map(event => {
                const eventTime = new Date(`${new Date().toDateString()} ${event.time}`);
                const isCurrent = now >= eventTime && now < new Date(eventTime.getTime() + 3600000); // 1 hour duration
                
                return `<li class="${isCurrent ? 'current-event' : ''}">
                    <span>${event.time}</span> - ${event.event}
                </li>`;
            }).join('');
            
            document.getElementById('events-list').innerHTML = eventsHtml;
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    // Initial Load
    loadWeather();
    showPhoto(0);
    startSlideshow();
    loadStreams();
    loadEvents();

    // Regular Updates
    setInterval(loadWeather, 3600000); // Update weather hourly
    setInterval(loadStreams, 60000); // Check stream time every minute
    setInterval(loadEvents, 60000); // Update events every minute
});