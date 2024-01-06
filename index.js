const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
//middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.fy83a0s.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   

    const carBrandCollection = client.db('carCollectionDB').collection('carBrand');

    app.get('/car', async (req, res) => {
      const cursor = carBrandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/car/:id', async (req, res) => {

      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result =await carBrandCollection.findOne(query);
      res.send(result);
    })

    app.post('/car', async (req, res) => {
      const AddNewCar = req.body;
      const result = await carBrandCollection.insertOne(AddNewCar)
      res.send(result);
     
    })

    app.put('/car/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const carCollection = req.body;
      const car = {
        $set: {
          Name: carCollection.Name,
          brandName: carCollection.brandName,
          Price: carCollection.Price,
          Type: carCollection.Type,
          Rating: carCollection.Rating,
          ShortDescription: carCollection.ShortDescription,
          photoUrl: carCollection.photoUrl
        }
      }
      const result = await carBrandCollection.updateOne(filter, car, options);
      res.send(result);

    })

    app.delete('/car/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await carBrandCollection.deleteOne(query);
      res.send(result);
    })




    // Send a ping to confirm a successful connection
   
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('car server is running');
})

app.listen(port, () => {
  console.log(`car server is running on this': ${port}`)
})