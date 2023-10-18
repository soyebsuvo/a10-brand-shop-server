const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://soyebbeen:iuJpH95TZ26LhqyL@cluster0.1qnjuxu.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db("productDB").collection("product");
    const cartCollection = client.db("cartDB").collection("cart");

    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand;
      // console.log(brand)
      const query = { brand: brand };
      // const options = {}
      // console.log(query)
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      // console.log(result)
      res.send(result);
    });

    app.get("/products", async (req , res) => {
        const result = await productCollection.find().toArray();
        res.send(result)
    })

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
    //   console.log(result);
      res.send(result);
    });

    app.get("/carts" , async (req , res) => {
        const result = await cartCollection.find().toArray();
        res.send(result)
    })

   
    app.post("/carts" , async (req , res) => {
        const carts = req.body;
        const result = await cartCollection.insertOne(carts);
        res.send(result);
    })

    app.get("/cartsDetails/:cartId" , async (req , res) => {
        const id = req.params.cartId;
        const query = {_id : new ObjectId(id)};
        const result = await cartCollection.findOne(query);
        console.log(result)
        res.send(result);
    })

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is runnig");
});

app.listen(port, () => {
  console.log(`The server is running on port : ${port}`);
});
