const express = require("express");
//object destructurinng
const { MongoClient } = require("mongodb")
//ES5 usage asa mongoclient
// csont mongolient = require('mongodb').mongoclient;

const bodyParser = require("body-parser");

const ObjectId = require("mongodb").ObjectId;
const connectToMongoDb = require('./db/checkdb')
const app = express();

const MongoURL = 'mongodb://127.0.0.1:27017/';
const port = 5005;


const client = new MongoClient(MongoURL, {
    useNewURlParser : true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let db;

client.connect((dbconnectionerror,connection) =>{
    if(dbconnectionerror){
        response.send({
            status:500,
            message:"db connection error",
    
        });

    }else{
        db = connection.db("zomatodb");
        app.listen(port,( ) => {
            console.log("server started on port ", port);
        });
    }
});

app.get("/getOrderDetails", (req,res)=>{
    if(db) {
        db.collection("orderdetails")
        .find()
        .toArray((err,result) =>{
            if(err){
                console.log(err);

            }
            else{
                res.send(result);
            }
        });
    }
})


app.post("/addOrderDetails",(request,response) =>{
    if(db) {
        db.collection("orderdetails").insertOne(request.body,(err,result) =>{
            if(err){
                console.log(err);
            }else{
                response.send("Added successfully");
            }
        });
    }
});

app.put("/updateOrderDetails", (request,response) =>{
    if(db) {
        db.collection("orderdetails").updateOne(
            { _id: ObjectId(request.body._id)},
            {
                $set: {
                    item : request.body.item,
                    price : request.body.price,
                    restaurant : request.body.restaurant,
                },
            },
            request.body,((err,result) => {
                if(err){
                    console.log(err);
                } else{
                    response.send("order details updpated succesfully");

                }
            }
        ) 
)}
})

app.delete("/deleteOrderDetails", (request,response) =>{
    if(db) {
        db.collection("orderdetails").remove(
            { _id: ObjectId(request.body._id)},

            (err,result) => {
                if(err){
                    console.log(err);

                }else{
                    response.send("orderdetails removed successfully")
                }
            }
        )
    }
})