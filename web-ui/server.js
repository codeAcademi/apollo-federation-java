import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  🌐  Web UI Server                      ║');
  console.log('╚══════════════════════════════════════════╝\n');
  console.log(`✨ Server running at http://localhost:${PORT}`);
  console.log(`🔗 Gateway: http://localhost:4000/graphql`);
  console.log('\n💡 Open http://localhost:3000 in your browser\n');
});
