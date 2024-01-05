import jwt from "jsonwebtoken";
import { getUser } from "../modules/client";
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.accsessToken || req.headers['x-access-token'];

    if(!accessToken) return res.status(401).json({msg:'permision denied!'});

    const  decodeFunc = async (err, decoded) => {
        if (err) return res.status(403).json({msg:'verify token fail!'});

        req.username = decoded?.username

        try {
            const user = await getUser(decoded?.username)
            !user ? res.status(403).json({msg: 'veryfy user fail!'}) : next()
            
        } catch (error) {
            res.status(403).json({msg:'verify user fail!'})
        }
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, decodeFunc)
}

export default verifyToken