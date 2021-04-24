const express = require("express")
const router = express.Router();
const jwt = require('jsonwebtoken');
const { MongoClient } = require("mongodb");
const bcrypt = require('bcryptjs')

const uri =
  "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

router.post("/signup",async(req,res)=>{
    let userDetail = req.body;
    try {
        await client.connect();
        const database = client.db('userList');
        const user =  database.collection('user');
        userDetail['password'] = await bcrypt.hash(userDetail['password'],8);
        const userData = await user.insertOne(userDetail);
        res.status(200).send(userData['ops'][0])
    } catch (error) {
        console.log('user',error)
        res.status(400).send({message:error.massage});
    }
})


router.post("/login",async(req,res)=>{
    try {
        await client.connect();
        const database = client.db('userList');
        const user =  database.collection('user');
        const userData = await user.findOne({mobile:req.body.mobile});
        const ismatch = await bcrypt.compare(req.body.password,userData['password']);
        if (ismatch) {
            const token = await jwt.sign({mobile:userData['mobile'].toString()},"jgasbncabnckhckghacjlcaj")
            res.status(200).send({mobile:userData['mobile'],token});
        }else{
            throw new Error('Unable to login');
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message:error.massage});
    }
})





module.exports = router;