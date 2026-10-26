import express from 'express'
import pool from './config/conexion.js'
const app = express()
const PORT = 3000

// test connection
// pool.getConnection()

//Integramos front
app.use(express.static('./public'))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('API Rest Mysql')
})

//Obtener todos los registros
app.get('/personas', async (req, res) => {
    const sql = "SELECT * FROM personas";
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql);
        connection.release(); //libera conexion   
        res.json(rows)
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})


//Obtener todos los registros que cumplan con una busqueda
app.get('/personas/buscar', async (req, res) => {

    const nombreB = req.query.nombre || '';
    const dniB = req.query.dni || '';

    console.log(nombreB,dniB)

    const sql = "SELECT * FROM personas WHERE nombre LIKE ? AND dni LIKE ?";
    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.query(sql, [
            `%${nombreB}%`,
            `%${dniB}%`
        ]);

        connection.release(); //libera conexion   
        res.json(rows)
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})




//Obtener un registro identificado por un  ID
app.get('/personas/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    // console.log(id)
    const sql = "SELECT * FROM personas WHERE id = ?";
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);
        //hay que pasale el sql y el dato que reemplaza el signo ?

        (rows[0]) ? res.json(rows[0]) : res.send('El usuario no existe')
        //rows devuelve un array que contiene un objeto, con [0] tomo solo el objeto  
        connection.release();
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})

//Obtener un registro identificado por un  ID
app.get('/personas/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    // console.log(id)
    const sql = "SELECT * FROM personas WHERE id = ?";
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);
        //hay que pasale el sql y el dato que reemplaza el signo ?

        (rows[0]) ? res.json(rows[0]) : res.send('El usuario no existe')
        //rows devuelve un array que contiene un objeto, con [0] tomo solo el objeto  
        connection.release();
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})
//Escribir un nuevo registro
app.post('/personas', async (req, res) => {
    const values = req.body
    // console.log(values)

    // const sql = "INSERT INTO personas (nombre, edad, dni, imagen) VALUES (?,?,?,?)";
    const sql = 'INSERT INTO personas SET ?'; //equivalente a lo de arriba
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [values]);
        //hay que pasale el sql y el dato que reemplaza el signo ?

        connection.release();

        console.log(rows)
        //rows devuelve muchos datos entre ellos el id creado que lo uso para el send, insertId
        res.status(201).send(`Registro creado con id ${rows.insertId}`)
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})

//Modificar datos de un registro identificado por un  ID
app.put('/personas/:id', async (req, res) => {
    const id = req.params.id
    const values = req.body
    // console.log(values)

    const sql = 'UPDATE personas SET ? WHERE id = ?';
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [values, id]);
        connection.release();
        // console.log(rows)
        // console.info(rows.affectedRows)
        if (rows.affectedRows == 0) { return res.send('Usuario no existe') }
        res.send('Usuario actualizado')
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})

//Eliminar un registro identificado por id
app.delete('/personas/:id', async (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM personas WHERE id = ?";
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);  //hay que pasale el sql y el dato que reemplaza el signo ?
        connection.release();
        // console.log(rows)
        // //affectedRoews muestra la cant de registros actualizados si es igual a cero no modifico ningun registro
        (rows.affectedRows == 0) ? res.send('Usuario no existe') : res.status(204).send()
    } catch (error) {
        res.status(500).send('ERROR, no se pudo realizar la consulta')
    }
})

//Paginas inexistentes - errores de url
app.use((req, res) => {
    res.status(404).send('Pagina inexistente')
})

app.listen(PORT, () => { console.log(`Servidor corriendo en http://localhost:${PORT}`) })