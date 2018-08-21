const express = require('express')
const app = express()
var bodyParser = require('body-parser');
var MongoObjectID = require("mongodb").ObjectID;

var two_hours=1000*60*60;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbobj=null;
var db_name="shops";

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// store disliked shops
app.locals.dislike_shops=[];

// connect to database
MongoClient.connect(url, function(err, db) {
  if (err)
    console.log(err);
  console.log("Connection to database ")
  dbobj = db.db(db_name);
});


// sign in route
app.post('/signin',urlencodedParser, (req, res) => {
  var query=req.body;

  dbobj.collection("user",function (err, collection) {
    collection.findOne(query, function(err, result) {
      if (err) throw err;
      console.log("Athentify user :"+JSON.stringify(query));
      response={}
      if(!result){
        response.succeeded=false;
        response.error="Error while authentification !"
      }else{
        response.succeeded=true;
        response.data=result;
      }
      res.json(response)
    });
  });

});

// sign up
app.post('/signup',urlencodedParser, function (req, res) {
  // Prepare output in JSON format
  query = {
     email:req.body.email
  }

  dbobj.collection("user",function (err, collection) {
    collection.findOne(query, function(err, result) {
      if (err) throw err;
      response={succeeded:true}
      if(!result){
        query = req.body
        dbobj.collection("user",function (err, collection) {
          collection.insertOne(query,function(err, result){
            if (err) throw err;
            console.log("Register new user :"+JSON.stringify(query));
            response={}
            if(!result){
              response.succeeded=false;
              response.error="Error while authentification !"
            }else{
              response.succeeded=true;
              response.data=result.ops[0];
            }
            res.json(response)
          });
        });
      }else{
        response={
          succeeded:false,
          error:"Email already exist !"
        }
        res.json(response)
      }
    });
  });
});

// get nearby shops
app.post('/nearby_shops',urlencodedParser, function (req, res) {
  query = req.body
  response={};
  var shops_id=[] // shops to not return

  // eliminate disliked shops
  app.locals.dislike_shops.forEach((item,index)=>{
    if(item.time<(Date.now()-two_hours)){
      app.locals.dislike_shops.splice(index,1)
    }else if(item.user_id===query.user_id){
      shops_id.push(new MongoObjectID(item.shop_id));
    }
  });

  // searshing first for prefered shops to eliminate them
  dbobj.collection("prefered_shops",function (err, collection) {
    collection.find(query).toArray(function(err, result) {
      if (err) {
        response.succeeded=false
        response.error=err;
        res.json(response);
      }

      console.log("prefered shops :"+JSON.stringify(query));

      // eliminate prefered shops
      result.forEach((item)=>{
        shops_id.push(new MongoObjectID(item.shop_id));
      });

      // searshing for shops that are not prefered and not disliked
      var collection = dbobj.collection('shops');
      // prepare pipeline
      var pipeline=[
        /*{
          $geoNear: {
            near: { type: "Point", coordinates: [ -6.83746, 33.91183 ] },
            distanceField: "dist.calculated",
            maxDistance: 2000,
            query: { type: "public" },
            includeLocs: "dist.location",
            num: 5,
            key:"location",
            spherical: true
          }
        },*/
        {
          $match:{
            _id:{
              "$not":{
                "$in":shops_id
              }
            }
          }
        }
      ];

      // aggregation options
      var options={
          explain:false
        };

      console.log(JSON.stringify(pipeline))

      // execute aggregation
      collection.aggregate(pipeline,options,function (err, result) {
          result.get((err,data)=>{
            if(err){
              response.succeeded=false
              response.error=err;
            }else{
              response.succeeded=true
              response.data=data;
            }
            res.json(response)
          });
        }
      );

    });
  });
});

// get prefered shops
app.post('/prefered_shops',urlencodedParser, function (req, res) {
  query = req.body
  response={};

  console.log("Return prefered shops :"+JSON.stringify(query));

  dbobj.collection("prefered_shops",function (err, collection) {
    collection.find(query).toArray(function(err, result) {
      if (err) {
        response.succeeded=false
        response.error=err;
        res.json(response);
      };

      var shops_id=[]
      result.forEach((item)=>{
        shops_id.push(new MongoObjectID(item.shop_id));
      });
      // get shops
      query={'_id':{'$in':shops_id}};

      dbobj.collection("shops",function (err, collection) {
        collection.find(query).toArray(function(err, result) {
          if (err) {
            response.succeeded=false
            response.error=err;
          }else {
            response.succeeded=true
            response.data=result;
          }
          res.json(response)
        });
      });
    });
  });
});

// remove prefered shop
app.post('/remove_prefered_shop',urlencodedParser, function (req, res) {
  query = req.body;
  response={};
  console.log("Remove prefered shop :"+JSON.stringify(query));

  dbobj.collection("prefered_shops",function (err, collection) {
    collection.deleteOne(query,function(err, result){
      if (err) {
        response.succeeded=false
        response.error=err;
      }else {
        response.succeeded=true
        response.data=result;
      }
      res.json(response)
    });
  });
});

// like shop
app.post('/like_shop',urlencodedParser, function (req, res) {
  data = req.body
  response={};
  console.log("Like shop :"+JSON.stringify(query));

  dbobj.collection("prefered_shops",function (err, collection) {
    collection.insertOne(data,function(err, result){
      if (err) {
        response.succeeded=false
        response.error=err;
      }else {
        response.succeeded=true
        response.data=result.ops[0];
      }
      res.json(response)
    });
  });
});

// dislike shop
app.post('/dislike_shop',urlencodedParser, function (req, res) {
  data = req.body
  data.time=Date.now();
  app.locals.dislike_shops.push(data);
  console.log('local : '+JSON.stringify(app.locals.dislike_shops));
  response={}
  response.succeeded=true;
  response.data={};
  res.json(response)

});


// run server
app.listen(4000, () => {console.log('App listening on port 4000!')});
