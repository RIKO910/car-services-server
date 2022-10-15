const express = require('express');
const cors =require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app =express();
const port =process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
//password:zsIaHntenATorwzs


const uri = "mongodb+srv://rikouser:zsIaHntenATorwzs@cluster0.fc3dngw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const serviceCollection =client.db("carServer").collection("service");

        //load data
        app.get('/service',async(req,res)=>{
            const query ={};
            const cursor =serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })
        app.get('/service/:id',async(req,res)=>{
            const id =req.params.id;
             const query ={_id: ObjectId(id)}
             const service =await serviceCollection.findOne(query);
             res.send(service);
        })
        //post user :add a new user
        app.post('/service',async(req,res)=>{
            const newUser =req.body
            console.log('adding a new user',newUser);
            const result =await serviceCollection.insertOne(newUser);
            res.send(result)
        })

        //delete a user
        app.delete('/service/:id',async(req,res)=>{
             const id =req.params.id;
             const query ={_id: ObjectId(id)}
             const result =await serviceCollection.deleteOne(query);
             res.send(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Running car server')
})
app.listen(port,()=>{
    console.log('listening to port',port)
})