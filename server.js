const express = require('express');
// object destructuring
const {MongoClient} = require('mongodb');
//ES5 usage of mongoclient
//const mongoClient = require('mongodb').mongoClient;

const bodyParser = require('body-parser');
const ObjectId = require("mongodb").ObjectId

const app = express();

const MongoURL = 'mongodb://127.0.0.1:27017/';
const port =5004;



//connection to database
//previously mongodb has two connection string mongodb+srv: // mongobd://
const client = new MongoClient( MongoURL,{
    usenewURLparser:true,
    useUnifiedTopology:true
})

//express middleware section

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get("/", (req,res)=>{
    res.send("welcome to the mongodb api response")
})
// get orderdetails end point

app.get("/getOrderDetails", (request,response)=>{
    client.connect((dbconnectionerror,connection)=>{
        if(dbconnectionerror){
        response.send({
            status: 500, 
            message: "db connection error",
        });
        }else{
        const db = connection.db("zomatodb");
        
        db.collection('orderdetails')
        .find()
        .toArray((err,result) => {
            if(err){
                console.log(err)

            }
            else {
                response.send(result)
            }
        });
    }});
});

//add order details end point

app.post("/addOrderDetails", (request, response) => {
    client.connect((dbconnectionerror, connection) => {
      if (dbconnectionerror) {
        response.send({
          status: 500,
          message: "db connection error",
        });
      } else {
        const db = connection.db("zomatodb");
        db.collection("orderdetails").insertOne(request.body,(err, result) => {
            if (err) {
              console.log(err);
            } else {
              response.send("order details added successfully");
            }
          });
      }
    });
  });
  
  app.put("/updateOrderDetails", (request, response) => {
    client.connect((dbconnectionerror, connection) => {
      if (dbconnectionerror) {
        response.send({
          status: 500,
          message: "db connection error",
        });
      } else {
        const db = connection.db("zomatodb");
        db.collection("orderdetails").updateOne({_id : ObjectId(request.body._id)},{$set :{price:request.body.price,restaurant:request.body.restaurant}},request.body,(err, result) => {
            if (err) {
              console.log(err);
            } else {
              response.send("order details updated successfully");
            }
          });
      }
    });
  });

  app.delete("/deleteOrderDetails", (request, response) => {
    client.connect((dbconnectionerror, connection) => {
        if (dbconnectionerror) {
            response.send({
              status: 500,
              message: "db connection error",
            });
          } else {
            const db = connection.db("zomatodb");
            db.collection("orderdetails").remove({_id: ObjectId(request.body._id)}),(err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  response.send("order details deleted successfully");
                }
              }}
            });
    })
      
    



app.listen(port,()=>{
    console.log('server started on port',port)

});