const express = require('express');
const app = express();
const pool = require('./db');

// middleware
app.use(express.json());

// =======================
// TEST API
// =======================
app.get('/', (req, res) => {
  res.send('API Perpustakaan jalan 🚀');
});

// =======================
// GET semua data buku
// =======================
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal ambil data' });
  }
});

// =======================
// GET buku berdasarkan ID
// =======================
app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM books WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal ambil data by ID' });
  }
});

// =======================
// POST tambah buku
// =======================
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, year, stock } = req.body;

    const result = await pool.query(
      'INSERT INTO books (title, author, year, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, author, year, stock]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal tambah data' });
  }
});

// =======================
// PUT update buku
// =======================
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, stock } = req.body;

    const result = await pool.query(
      'UPDATE books SET title=$1, author=$2, year=$3, stock=$4 WHERE id=$5 RETURNING *',
      [title, author, year, stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({
      message: 'Berhasil update',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal update data' });
  }
});

// =======================
// DELETE buku
// =======================
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM books WHERE id=$1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Berhasil hapus' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal hapus data' });
  }
});

// =======================
// JALANKAN SERVER
// =======================
app.listen(5000, () => {
  console.log('Server jalan di http://localhost:5000 🚀');
});