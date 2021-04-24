const express = require("express")
const router = express.Router();
const { MongoClient } = require("mongodb");
const auth = require('../middleware/auth')

const uri =
  "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


router.post("/postCar",auth,async(req,res)=>{
    let car = req.body;
    try {
        await client.connect();
        const database = client.db('cars');
        const collectionList =await database.listCollections({name:car.manufacturer},{nameOnly:true}).toArray()
        let carData;
        if (collectionList.length > 0) {
            const manufacturer = await database.collection(car.manufacturer);
            carData = await manufacturer.insertOne(car)
        } else {
           const manufacturer = await database.createCollection(car.manufacturer);
           carData = await manufacturer.insertOne(car)
        }
        res.status(200).send(carData['ops']);
    } catch (error) {
        console.log(error);
        res.status(400).send({message:error.message});
    }
})

router.get("/getCar/:query",auth,async(req,res)=>{
    console.log('req',req.params.query);
    let query = JSON.parse(req.params.query);
    console.log('parsed',req.params.query)
    if (!query) {
        query = {}
    }
    try {
        let cars = [];
        await client.connect();
        const database = client.db('cars');
        const collectionList = (await database.listCollections({},{nameOnly:true}).toArray()).map(m=>m.name);
        for await (const mnf of collectionList) {
            const manufacturer = database.collection(mnf);
            const carData = await manufacturer.find(query).toArray();
            cars = [...cars,...carData];
        }
        res.status(200).send(cars);
    } catch (error) {
        res.status(400).send({message:error.massage});
    }
})


module.exports = router;