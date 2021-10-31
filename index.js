const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midlewere
app.use(cors())
app.use(express.json())

// connect mongo db 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tul8s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect()

        // declare db name and collection name

        const database = client.db('pathfriend-db')
        const travelsCollection = database.collection('travels')
        const bookingCollection = database.collection('bookings')
        
        // post travel
        app.post('/travels', async(req,res)=>{
            const result = await travelsCollection.insertOne(req.body)
            res.send(result)
        })

        // get offer travels 

        app.get('/travels', async(req, res)=>{
            const cursor = travelsCollection.find({})
            const travels = await cursor.toArray()
            res.send(travels)
        })

        // post bookng api 

        app.post('/bookingtravels', async(req,res)=>{
            const result = await bookingCollection.insertOne(req.body)
            res.send(result)
        })
        // get bookng api 

        app.get('/bookings', async(req,res)=>{
            const cursor = bookingCollection.find({})
            const bookings = await cursor.toArray()
            res.send(bookings)
        })

        // update status --------

        app.put('/bookings/:id',async(req,res)=>{
            const id = req.params.id;
            const filter ={_id: ObjectId(id)}
            console.log(filter);
            const update = {
                $set: {
                    status:'approved'
                },
              };

              const result = await bookingCollection.updateOne(filter, update)
              res.send(result)
             
        })

        // delete single booking tralvel api 



        app.delete('/bookings/:id', async(req,res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            console.log(query);
            const result = await bookingCollection.deleteOne(query)
            console.log(result);
            res.send(result)
        })
        
    }
    finally{
        // await client.close()
    }
}


run().catch(console.dir)


app.get('/', (req,res)=>{
    res.send('pathfriend server running')
})

app.listen(port,()=>{
    console.log('listening to the port', port);
})