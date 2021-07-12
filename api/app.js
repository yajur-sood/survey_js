const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors())

const MongoClient = require('mongodb').MongoClient;

let products
// Initialize connection once
MongoClient.connect("mongodb://127.0.0.1/", { useNewUrlParser: true, useUnifiedTopology: true }, function(err, database) {
    if(err) return console.error(err);
    products = database.db('products');
});

app.get('/', (req,res)=>{
    const productNames = []
    products.collection('product').find().forEach(doc=>{
        productNames.push(doc)
    }).then(()=>{
        res.send(productNames)
    })
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})