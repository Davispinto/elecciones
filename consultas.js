const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "elecciones",
    password: "graficas014",
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
});

const guardarCandidato = async (candidato) => {
    const values = Object.values(candidato);
    const consulta = {
        text:
            "insert into candidatos (nombre, foto, color, votos) values ($1, $2, $3, 0)",
        values,
    };
    const result = await pool.query(consulta);
    return result;
};

const getCandidatos = async () => {
    const result = await pool.query("select * from candidatos");
    return result.rows;
};

const editCandidato = async (candidato) => {
    const values = Object.values(candidato);
    const consulta = {
        text:
            "update candidatos set nombre = $1, foto = $2 where id = $3 RETURNING *",
        values,
    };
    const result = await pool.query(consulta);
    return result;
};

const eliminarCandidato = async (id) => {
    const result = await pool.query(`delete from candidatos where id = ${id}`);
    return result.rows;
}

const registrarVotos = async (voto) => {
    const values = Object.values(voto);

    const registrarVotoHistorial = {
        text: "insert into historial (estado, votos, ganador) values ($1, $2, $3)",
        values,
    };

    const registrarVotoCandidato = {
        text: "update candidatos set votos = votos + $1 where nombre = $2",
        values: [Number(values[1]), values[2]],
    };

    try {
        await pool.query("BEGIN");
        await pool.query(registrarVotoHistorial);
        await pool.query(registrarVotoCandidato);
        await pool.query("COMMIT");
        return true
    } catch (e) {
        await pool.query("ROLLBACK")
        throw e;
    }
};

const gethistorial = async () => {
    const consulta = {
        text: 'select * from historial',
        rowMode: "array",
    };
    const result = await pool.query(consulta);
    return result.rows;
}

module.exports = {
    guardarCandidato,
    getCandidatos,
    editCandidato,
    eliminarCandidato,
    registrarVotos,
    gethistorial
};