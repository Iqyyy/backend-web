require("dotenv").config();
const bcrypt = require('bcryptjs');
const db = require("../db.config/db.config");

const register = async(req, res, next) => {
    const { nama, email, password, alamat } = req.body
    const hash = await bcrypt.hash(password,10)
    try {
    
        await db.query(`INSERT INTO users VALUES (DEFAULT, $1, $2, $3, DEFAULT, $4)`, [nama, email, hash, alamat])
        res.send("Data Register Success")
    } catch (error){
        res.send(error)
    }
}

const login = async(req, res, next) => {

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