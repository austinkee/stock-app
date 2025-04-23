const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const uri = 'mongodb+srv://austinkee:austinkee@cluster0.xkewrgb.mongodb.net/Stock?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

let db;
client.connect().then(() => {
  db = client.db('Stock');
  console.log("Connected to MongoDB Atlas.");
});

// Home View
app.get('/', (req, res) => {
  res.render('index');
});

// Process View
app.get('/process', async (req, res) => {
  const { searchType, query } = req.query;
  if (!searchType || !query) {
    return res.send("Missing search type or query.");
  }

  let filter = {};
  if (searchType === 'ticker') {
    filter = { ticker: query };
  } else {
    filter = { company: query };
  }

  try {
    const results = await db.collection('PublicCompanies').find(filter).toArray();
    console.log("Search Results:", results);
    res.render('process', { results });
  } catch (err) {
    console.error("Error during DB search:", err);
    res.send("Error retrieving results.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});