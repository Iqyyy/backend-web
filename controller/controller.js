require("dotenv").config();
const bcrypt = require('bcryptjs');
const db = require("../db.config/db.config");

const register = async(req, res, next) => {
    const { nama, email, password, alamat } = req.body
    const hash = await bcrypt.hash(password,10)
    try {
        // await db.query
        await db.query(`INSERT INTO users VALUES (DEFAULT, $1, $2, $3, DEFAULT, $4)`, [nama, email, hash, alamat])
        res.send("Data Register Success")
    } catch (error){
        res.send(error)
    }
}

const login = async(req, res, next) => {
    const { email , password } = req.body
    const datas = await db.query(`SELECT * FROM users WHERE email=$1`,[email])

    try{

        await bcrypt.compare(password, datas.rows[0].password, (err, response)=>{
            if (err){
                res.send(err)
            }
            if (!response) {
                res.send(`Invalid Email or Password`)
            }
            else {

                const data = {
                    id: datas.rows[0].id,
                    nama: datas.rows[0].nama,
                    email: datas.rows[0].email,
                    password: datas.rows[0].password,
                    alamat: datas.rows[0].alamat
                }

                const token = jwt.sign(data, process.env.SECRET)
                datas.rows[0].token = token

                res.cookie("token", token).status(200)
            }
        })
    }
    catch(error){
        res.send(error)
    }

}

const logout = async(req, res, next) => {

}

const verify = async(req, res, next) => {

}

module.exports = {
    register,
    login,
    logout,
    verify
}