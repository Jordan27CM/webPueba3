const pool = require('../config/db');

module.exports = {
  buscarTodo: async () => {
    const [rows] = await pool.query(`
      SELECT g.*, c.nombre AS clan
      FROM gatos g
      JOIN clanes c ON g.clan_id = c.clan_id
    `);
    return rows;
  },
  buscarId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM gatos WHERE gato_id = ?', [id]);
    return rows[0];
  },
  crear: async (gato) => {
    const { nombre, raza, fecha_nacimiento, clan_id } = gato;
    await pool.query('INSERT INTO gatos (nombre, raza, fecha_nacimiento, clan_id) VALUES (?, ?, ?, ?)', [nombre, raza, fecha_nacimiento, clan_id]);
  },
  actualizar: async (id, gato) => {
    const { nombre, raza, fecha_nacimiento, clan_id } = gato;
    await pool.query('UPDATE gatos SET nombre = ?, raza = ?, fecha_nacimiento = ?, clan_id = ? WHERE gato_id = ?', [nombre, raza, fecha_nacimiento, clan_id, id]);
  },
  eliminar: async (id) => {
    await pool.query('DELETE FROM gatos WHERE gato_id = ?', [id]);
  },

  buscarTodoPorClan: async () => {
    const [rows] = await pool.query(`
      SELECT g.*, c.nombre AS clan_nombre 
      FROM gatos g
      JOIN clanes c ON g.clan_id = c.clan_id
    `);
    return rows;
  },
  contarPorClan: async (clanId) => {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM gatos WHERE clan_id = ?',
      [clanId]
    );
    return rows[0].count;
  },
  filtro: async (nombre, clan_id) => {
    let query = `
    SELECT g.*, c.nombre AS clan_nombre,
           TIMESTAMPDIFF(YEAR, g.fecha_nacimiento, CURDATE()) AS edad,
           DATE_FORMAT(g.fecha_nacimiento, '%d-%m-%Y') AS fechaFormateada
    FROM gatos g
    JOIN clanes c ON g.clan_id = c.clan_id
    WHERE 1 = 1
  `;
    const params = [];

    if (nombre) {
      query += ' AND g.nombre LIKE ?';
      params.push(`%${nombre}%`);
    }

    if (clan_id) {
      query += ' AND g.clan_id = ?';
      params.push(clan_id);
    }

    query += ' ORDER BY g.nombre';

    const [rows] = await pool.query(query, params);
    return rows;
  },
  buscarPorClan: async (clan_id) => {
    const [rows] = await pool.query(`
    SELECT *, TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) AS edad
    FROM gatos
    WHERE clan_id = ?
  `, [clan_id]);
    return rows;
  },
  buscarPorIdConClan: async (id) => {
    const [rows] = await pool.query(`
    SELECT g.*, c.nombre AS clan_nombre
    FROM gatos g
    JOIN clanes c ON g.clan_id = c.clan_id
    WHERE g.gato_id = ?
  `, [id]);

    return rows[0];
  }

};
