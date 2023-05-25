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

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.options(cors(corsOptions)); 
// callback(null, {
//   statusCode: 200,
//   body: "Hello, world!",
//   headers: {
//     "access-control-allow-origin": "*",
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     'Access-Control-Allow-Methods': '*'
//   }
// });
app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
//     response.setHeader("Access-Control-Allow-Origin", "*");
// response.setHeader("Access-Control-Allow-Credentials", "true");
// response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
// response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
  });

                                           
const clientPromise = mongoClient.connect();

  const agg = [
    {
      '$search': {
        'index': 'default', 
        'text': {
          'query': "\"modern home\"", 
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

        //  const resul = await collection.aggregate(agg).limit(1);
        const results = await collection.find().sort({'_id': -1}).limit(4).toArray();
        // const  results = await resul.toArray();
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
{
  try{
 //let data=JSON.parse(req.body) ;
    const agg = [
        {
          '$search': {
            'index': 'default', 
            'text': {
              'query': 'home', 
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
         
       
    res.send(results);
    }catch(err){
        res.send({statusCode: 500, body: err.toString()});
    }
});
     

app.use("/",router);
module.exports.handler=serverless(app);