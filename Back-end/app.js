
let express=require("express");
let app = express();
let cors = require("cors");
let bodyParser = require("body-parser");
let mongoClient = require("mongodb").MongoClient;
let PORT = 3002;
let dbURL = "mongodb://localhost:27017";

app.listen(PORT , () => console.log(`Server is running in ${PORT}`));

app.use(cors());
app.use(bodyParser.json());

//Customer Login Service
app.get("/customer/:cust_id/:pass" , (request , response) =>{
    let cust_id = parseInt(request.params.id);
    let pass = request.params.password;
    mongoClient.connect(dbURL , {useNewUrlParser: true} , (error , client) =>{
        if(error) {
            throw error;
        }else {
            let db = client.db("newdb");
            db.collection("customer").findOne({_id:cust_id , password : pass})
            .then((doc) => {
                if (doc!=null) {
                    response.json(doc)
                }else{
                    response.status(404).json({"message":`sorry id or password is wrong`} )
                }
                client.close();
            });
        }
    });
});

//Update password of a customer
app.put("/customer/:cust_id/change_pass/:new_pass" , (request , response) => {
    let cust_id = parseInt(request.params.cust_id);
    let new_pass = parseInt(request.params.new_pass);
    mongoClient.connect(dbURL , {useNewUrlParser:true} , (error , client) =>{
        if(error) {
            throw error;
        }else{
            let db = client.db("newdb");
           
            db.collection("customer").updateOne({_id:cust_id},{$set:{password:new_pass}})
            .then((doc) => {
                response.json(doc);
                client.close();
                
            });

        }
    });
});

//Update password customer old and new password using customer id and old password


app.put("/customer/:cust_id/:old_pass/change_pass/:new_pass" , (request , response) => {
    let cust_id = parseInt(request.params.cust_id);
    let old_pass = request.params.password;
    let new_pass = request.params.new_pass;
   
    mongoClient.connect(dbURL , {useNewUrlParser:true} , (error , client) => {
        if(error) {
            throw error;
        }else {
            let db= client.db("newdb");

            db.collection("password").updateOne({customer_id:cust_id },{$set:{old_login_password:old_pass,new_login_password:new_pass,login_datetime:new Date().toUTCString()}})
            .then((doc) => {
                response.json(doc);
                client.close();

            });
        }
    });
});

