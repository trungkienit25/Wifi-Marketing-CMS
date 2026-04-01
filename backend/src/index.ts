import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 WiFi Marketing CMS Backend is running on http://localhost:${PORT}`);
  console.log(`📡 Use /api/v1/brands/config to initialize configuration with Drive URL.`);
});
