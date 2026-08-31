import app from './app.js';

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`TransitOps server running on port http://localhost:${PORT}`);
});
 