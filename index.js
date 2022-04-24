const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qizpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();

    const serviceCollection = client.db("geniusCar").collection("services");

    app.get('/services', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    })

    app.post('/addservice', async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    })

    app.delete('/manage/:id', async (req, res) => {
      const serviceId = req.params.id;
      const query = { _id: ObjectId(serviceId) }
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    })

  }
  finally {
    // await client.close()
  }
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Server is Running');
})

app.listen(port, () => {
  console.log('Server is running')
})