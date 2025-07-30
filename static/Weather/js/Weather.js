async function getWeather() {
    event.preventDefault();
    async function getCoordinates(city) {
        const url = "https://nominatim.openstreetmap.org/search";
        const params = new URLSearchParams({
            q: city,
            format: 'json',
            limit: 1,
            addressdetails: 1
        });

        const headers = {
            'User-Agent': 'MyApp/1.0 (gmail)'
        };

        try {
            const response = await fetch(`${url}?${params}`, { headers });
            const data = await response.json();
            return data.length > 0 ? { lat: data[0].lat, lon: data[0].lon } : null;
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            return null;
        }
    }

    async function getImageFromPexels(query) {
        const pexelsApiKey = 'api_key'; // <-- Replace with your real API key
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: pexelsApiKey
                }
            });

            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
                return data.photos[0].src.large;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Pexels API error:', error);
            return null;
        }
    }

    try {
        const apikey = 'api_key';
        const city = document.getElementById('city').value;
        const image = document.getElementById("image");
        const info = document.getElementById("img_info");
        image.style.display = "none";
        info.style.display = "none";

        const coordinates = await getCoordinates(city);

        if (coordinates) {
            const { lat, lon } = coordinates;
            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
            const response = await fetch(weatherApiUrl);
            const data = await response.json();

            if (data.cod === 200) {
                const City = city.trim().replace(/\b\w/g, char => char.toUpperCase());
                const description = data.weather[0].description;
                const weatherInfo = `
                    <p><strong>Location:</strong> ${City}, ${data.sys.country}</p>
                    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                    <p><strong>Weather:</strong> ${description}</p>
                    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                `;
                document.getElementById('weather-info').innerHTML = weatherInfo;

                const imageUrl = await getImageFromPexels(description);

                if (imageUrl) {
                    image.src = imageUrl;
                    info.innerHTML = description;
                    image.style.display = "block";
                    image.style.margin = "auto";
                    info.style.textAlign = "center";
                    info.style.display = "block";
                } else {
                    info.innerHTML = "No image found for weather condition.";
                    info.style.display = "block";
                }

            } else {
                document.getElementById('weather-info').innerHTML = `<p>Error fetching weather data. Please check the city name.</p>`;
            }

        } else {
            document.getElementById('weather-info').innerHTML = `<p>Could not get coordinates for the city. Please check again.</p>`;
        }

    } catch (error) {
        document.getElementById('weather-info').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
