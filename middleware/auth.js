const jwt = require('jsonwebtoken');
const { MongoClient } = require("mongodb");

const uri =
  "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const auth = async (req,res,next) =>{
   try {
       const token = req.header('Authorization').replace('Bearer ','')
    //    console.log('token',token);
       const decode = jwt.verify(token,"jgasbncabnckhckghacjlcaj");
        // console.log('decode',decode['mobile']);
       await client.connect();
        const database = client.db('userList');
        const user =  database.collection('user');
        const userData = await user.findOne({mobile:parseInt(decode['mobile'])});
        // console.log('user',userData);
       if (!userData) {
           throw new Error()
       }
       req.token = token
       req.user = userData
       next()
   } catch (error) {
       res.status(401).send('Please Authenticate!')
   }
}



module.exports = auth