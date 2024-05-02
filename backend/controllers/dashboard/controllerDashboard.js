const Cliente = require("../../models/clientes/modelClientes");
const Agenda = require("../../models/agenda/modelAgenda");

async function clienteConMasCitas(req, res) {
    try {
      const query = `
        SELECT c.nombre, COUNT(a.documento) AS total_citas
        FROM agendas AS a
        INNER JOIN clientes AS c ON a.documento = c.documento
        GROUP BY a.documento
        ORDER BY total_citas DESC
        LIMIT 1
      `;
  
      const resultado = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
  
      if (resultado.length === 0) {
        return res.status(404).json({ error: "No se encontraron clientes con citas" });
      }
  
      res.json(resultado[0]);
    } catch (error) {
      console.error('Error al obtener el cliente con más citas:', error);
      res.status(500).json({ error: 'Error al obtener el cliente con más citas' });
    }
  }

module.exports = {
    clienteConMasCitas
};
