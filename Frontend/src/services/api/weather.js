export const getWeatherForecast = async (location, days = 3) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("Thiếu VITE_WEATHER_API_KEY trong file .env");
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
    location,
  )}&days=${days}&aqi=no&alerts=no`;

  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.error?.message || "Không lấy được dữ liệu thời tiết",
    );
  }

  return res.json();
};
