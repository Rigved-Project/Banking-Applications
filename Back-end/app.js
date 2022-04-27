// import all the functions
let express = require("express");
let app = express();
let cors = require("cors");
let bodyParser = require("body-parser");
let mongoClient = require("mongodb").MongoClient;
let PORT = 3002;
let dbURL = "mongodb://localhost:27017";
// start the server 
app.listen(PORT, () => console.log(`Server is running in ${PORT}`));

// apply the middleware
app.use(cors());
app.use(bodyParser.json());

//create the services for Banking application

   
  
        app.get("/customer/cust_id/transaction/:account_id_sender", (request, response) => {
                // connect(url, parser, callback)
                    let account_id_sender = parseInt(request.params.account_id_sender);
                    mongoClient.connect(dbURL, {useNewUrlParser:true}, (error, client) => {
                        if(error) {
                            throw error;
                        } else {
                            let db = client.db("banking-app");
                            let users=[]
                            let cursor=db.collection("Transaction").find({account_num_sender: account_id_sender});
                            cursor.forEach((doc, err) => {
                                if(err)
                                    throw err;
                                users.push(doc);
                            }, () => {
                                response.json(users);
                                client.close();
                            });
                        }
                    });
                });

//url=/customer/transaction
app.post("/customer/transaction", (request, response) => {
    mongoClient.connect(dbURL, {useNewUrlParser:true}, (error, client) => {
        if(error) {
            throw error;
        } else {
            let db = client.db("banking-app");
            let customer = request.body; // 
            customer.Transaction= [];
            db.collection("Transaction").insertOne(customer, (err, res) => {
                if(err) {
                    response.status(409).json({"message":`customer ${customer_id} exists`})
                } else {
                    response.status(201).json(res);
                    client.close();
                }
            });
        }
    });
});