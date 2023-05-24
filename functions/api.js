const express = require ('express');
const app = express();
const router = express.Router();
const serverless = require ('serverless-http');
const bodyParser = require ('body-parser');
const { MongoClient } = require ('mongodb');
const url = 'mongodb+srv://Dhanush:SD18A2004@cluster0.2s94ek1.mongodb.net/';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const mongoClient = new MongoClient(url);
const cors = require("cors");      
app.use(express.json({limit: '50mb'}));
app.options(cors()); 
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

                                           
const clientPromise = mongoClient.connect();

  const agg = [
    {
      '$search': {
        'index': 'default', 
        'text': {
          'query': 'modern home', 
          'path': {
            'wildcard': '*'
          }
        }
      }
    }
  ];
  
  


const hand = async (event) => {
    try {
        const database = (await mongoClient).db("mini_project");
        const collection =await database.collection("image_generator");
         const resul = await collection.aggregate(agg).limit(1);
         
        const  results = await resul.toArray();
        return {
            statusCode: 200,
            body: JSON.stringify(results),
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

router.get('/',async function (req, res) {
        const aa = await hand();
        res.send(JSON.stringify(aa));
    });
router.post('/post',async(req,res)=>{
    try{

        const database = (await clientPromise).db("mini_project");
        const collection =await database.collection("image_generator");
        const results = await collection.insertOne(req.body);
        res.send(JSON.stringify(results));

    }catch(err){
        res.send({statusCode: 500, body: err.toString()});
    }});
router.post('/get',async(req,res)=>
{try
    {
  let data=JSON.parse(req.body) ;
    const agg = [
        {
          '$search': {
            'index': 'default', 
            'text': {
              'query': 'modern home', 
              'path': {
                'wildcard': '*'
              }
            }
          }
        }
      ];  
    const database = (await clientPromise).db("mini_project");
    const collection =database.collection("image_generator");

    const results = await collection.aggregate(agg).limit(1).toArray();
         
       
    res.send(JSON.stringify(results));
    }catch(err){
        res.send({statusCode: 500, body: err.toString()});
    }
});
     

app.use("/",router);
module.exports.handler=serverless(app);