require("dotenv").config();
const bcrypt = require('bcryptjs');
const db = require("../db.config/db.config");
const jwt = require('jsonwebtoken');


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
                    id_user: datas.rows[0].id_user,
                    nama: datas.rows[0].nama,
                    email: datas.rows[0].email,
                    password: datas.rows[0].password,
                    alamat: datas.rows[0].alamat
                }

                const token = jwt.sign(data, process.env.SECRET)
                datas.rows[0].token = token

                res.cookie("token", token).status(200).send(datas.rows[0])
            }
        })
    }
    catch(error){
        res.send(error)
    }

}

const profile = async(req, res, next) => {
    const verified = req.verified
    const datas = await db.query(`SELECT * FROM users where id_user=$1`, [verified])
    try {
        const data = {
            id_user: datas.rows[0].id_user,
            nama: datas.rows[0].nama,
            email: datas.rows[0].email,
            password: datas.rows[0].password,
            alamat: datas.rows[0].alamat
        }

        res.status(200).send(data)

    } catch(err) {
        console.log(err.message);
        return res.status(500).send(err)
    }
}

const addcart = async(req, res, next) => {
    const verified = req.verified
    const id_item = req.body.id_item
    const jumlah = req.body.count
    const datas = await db.query(`INSERT INTO CART VALUES(DEFAULT, $1, $2, $3)`, [verified, id_item, jumlah])
    try {
        const data = {
            id_user: datas.rows[0].id_user,
            nama: datas.rows[0].nama,
            email: datas.rows[0].email,
            password: datas.rows[0].password,
            alamat: datas.rows[0].alamat
        }

        res.status(200).send(data)

    } catch(err) {
        console.log(err.message);
        return res.status(500).send(err)
    }
}

const logout = async(req, res, next) => {
    try {
        res.clearCookie('token').send("Logout Success")
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)
    }
}

const verify = async(req, res, next) => {
    try {
        const verified = req.verified
        const datas = await db.query(`SELECT * FROM users WHERE id_user=$1`, [verified])
        res.status(200).json(datas.rows[0])
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)    
    }
}

module.exports = {
    register,
    login,
    profile,
    addcart,
    logout,
    verify
}