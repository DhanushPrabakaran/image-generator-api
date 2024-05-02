const express = require ('express');
const app = express();
const router = express.Router();

const bodyParser = require ('body-parser');

const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb+srv://Dhanush:V7OKCcur3Hzgc0SQ@cluster0.2s94ek1.mongodb.net/';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const mongoClient = new MongoClient(url);
const cors = require("cors");      
app.use(express.json({limit: '50mb'}));

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));                     
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
         const resul = await collection.find({}).limit(10).sort({_id:-1});
         
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

router.post('/login',async(req,res)=>{
  try{
    const database = (await clientPromise).db("mini_project");
    const collection =await database.collection("users");
    const results = await collection.find({"email":req.body.email,"password":req.body.password}).toArray();
    

    if(results.length>0){

     res.send({statusCode: 500, body:JSON.stringify(results) });
      }else{
        res.send({statusCode: 500, body: "Invalid Credentials"});
      
        }
        }catch(err){
   
          res.send({statusCode: 500, body: err.toString()});
          }

});
router.get("/delete/:id",async(req,res)=>{
  const id = req.params.id;
  const database = (await clientPromise).db("mini_project");
        const collection =await database.collection("image_generator");
  const query = { _id: new ObjectId(id) };

  const result = await collection.deleteOne(query);
  res.send(result);
   
  }); 
router.post('/register',async(req,res)=>{
  try{
    const database = (await clientPromise).db("mini_project");
    const collection =await database.collection("users");
    const results = await collection.insertOne(req.body);
    res.send(JSON.stringify(results));
    }catch(err){
      res.send({statusCode: 500, body: err.toString()});
      }

});   

router.post('/get/user',async(req,res)=>
{
  try{
  let body=req.body;
  let text = body.search;
 
    const database = (await clientPromise).db("mini_project");
    const collection =database.collection("image_generator");

    const results = await collection.find({name:`${text}`}).sort({_id:-1}).toArray();
         
       
    res.send(JSON.stringify(results));
    }catch(err){
        res.send({statusCode: 500, body: err.toString()});
    }
});

router.post('/get',async(req,res)=>
{
  try{
  let body=req.body;
  let text = body.search;
    const agg = [
        {
          '$search': {
            'index': 'default', 
            'text': {
              'query': `${text}`, 
              'path': {
                'wildcard': '*'
              }
            }
          }
        }
      ];  
    const database = (await clientPromise).db("mini_project");
    const collection =database.collection("image_generator");

    const results = await collection.aggregate(agg).sort({id:-1}).toArray();
         
       
    res.send(JSON.stringify(results));
    }catch(err){
        res.send({statusCode: 500, body: err.toString()});
    }
});
const port = process.env.PORT || 3000;

app.use("/",router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
