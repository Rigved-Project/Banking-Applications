let express=require("express");
let cors=require("cors");
let mongoClient=require("mongodb").MongoClient;
let parser=require("body-parser");
const { request } = require("http");
const { response } = require("express");
let bcrypt=require("bcryptjs");
let app=express();
let swaggerJsDoc=require('swagger-jsdoc');
let swaggerUI=require('swagger-ui-express')

const securePassword = async (password)=>{
    let passwordHash= await bcrypt.hash(password, 10);
    console.log(passwordHash);
    let passwordMatch= await bcrypt.compare(password,passwordHash);
    //console.log(passwordMatch)
}

securePassword('sumit123')

let dbURL="mongodb://localhost:27017";

let port=3002;

let swaggerOptions={
    swaggerDefinition:{
        info:{
            title:"Customer API",
            description: "Customer API Information",
            contact:{
                name:"Amazing Developer"
            },
            servers:["http://localhost:3002"]
        }
    },
    apis:["App.js"]
}

let swaggerDocs=swaggerJsDoc(swaggerOptions)

app.listen(port,()=>console.log(`Server running in ${port}`));

app.use(parser.json());

app.use(cors());

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

//Routes
/**
 * @swagger
 * /customer:
 *  get:
 *    tags:
 *       - Get Customer
 *    description: Use to request all Customer
 *    responses:
 *      '200':
 *          description: A successful response
*/

//get customer
app.get("/customer", (request, response) => {
    // connect(url, parser, callback)
    mongoClient.connect(dbURL, {useNewUrlParser:true}, (error, client) => {
        if(error) 
            throw error;
        let db = client.db("banking-app");
        let cursor = db.collection("Customer").find();
        let users = [];
        //cursor.forEach(callback1, callback2)
        cursor.forEach((doc, err) => {
            if(err)
                throw err;
            users.push(doc);
        }, () => {
            response.json(users);
            client.close();
        });
    });
});

/**
 * @swagger
 * /customer/{cust_id}:
 *  get:
 *    tags:
 *      - ID params
 *    description: Get by Customer Id
 *    parameters:
 *         - name: cust_id
 *           description: Enter Customer Id 
 *           in: path
 *           type: integer
 *           required: true
 *    responses:
 *      '200':
 *          description: A successful response
*/

//a)	Get name, account number, account type and available balance using customer id
//url=/customer/:cust_id


app.get("/customer/:cust_id",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let cust_id=parseInt(request.params.cust_id);
            let db=client.db("banking-app");
            db.collection("Account").findOne({customer_id:cust_id}).then((doc)=>{
                if(doc!=null){
                    response.status(200).json(doc);
                } else{
                    response.status(404).json({"message":`Sorry ${cust_id} doesn't exist`})
                }
                client.close();
            })
        }
    })
})

/**
 * @swagger
 * /customer/{cust_id}/{account_no_sender}/reduce_balance/{balance}:
 *  put:
 *    tags:
 *      - Update Balance of sender
 *    description: Update by Id
 *    parameters:
 *         - name: cust_id
 *           description: Enter Customer Id
 *           in: path
 *           type: integer
 *           required: true
 *         - name: account_no_sender
 *           description: Enter Account Number of sender
 *           in: path
 *           type: integer
 *           required: true
 *         - name: balance
 *           description: Enter Amount
 *           in: path
 *           type: integer
 *           required: true
 *    responses:
 *      '200':
 *          description: A successful response
*/

//b)	Update balance on basis of account number (Once the amount is transferred to anyone’s account the amount in the destination account table should also be updated as a total amount the account has. Store the date, bankid and IFSC when the transaction happens accordingly)
//Sender  url=/customer/:cust_id/:account_no/reduce_balance/:balance
app.put("/customer/:cust_id/:account_no_sender/reduce_balance/:balance",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let cust_id=parseInt(request.params.cust_id);
            let account_no=parseInt(request.params.account_no_sender);
            let balance=parseInt(request.params.balance);
            let db = client.db("banking-app");
            db.collection("Account").updateOne({customer_id:cust_id,_id:account_no},{$inc:{main_balance:-balance}}).then((doc)=>{
                response.status(200).json(doc);
                client.close();
            })
        }
    })
})

/**
 * @swagger
 * /customer/{account_no_receiver}/{ifsc}/increase_balance/{balance}:
 *  put:
 *    tags:
 *      - Update Balance of Receiver
 *    description: Update by Id
 *    parameters:
 *         - name: account_no_receiver
 *           description: Enter Account Number of Receiver
 *           in: path
 *           type: integer
 *           required: true
 *         - name: ifsc
 *           description: Enter IFSC
 *           in: path
 *           type: string
 *           required: true
 *         - name: balance
 *           description: Enter Amount
 *           in: path
 *           type: integer
 *           required: true
 *    responses:
 *      '200':
 *          description: A successful response
*/

//b)	Update balance on basis of account number (Once the amount is transferred to anyone’s account the amount in the destination account table should also be updated as a total amount the account has. Store the date, bankid and IFSC when the transaction happens accordingly)
//2)Receiver url= /customer/:account_no/:ifsc/increase _balance/:balance
app.put("/customer/:account_no_receiver/:ifsc/increase_balance/:balance",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let account_no=parseInt(request.params.account_no_receiver);
            let balance=parseInt(request.params.balance);
            let ifsc=request.params.ifsc
            let db = client.db("banking-app");
            db.collection("Account").updateOne({IFSC :ifsc,_id:account_no},{$inc:{main_balance:balance}}).then((doc)=>{
                response.status(200).json(doc);
                client.close();
            })
        }
    })
})

//c)	Get transaction password using customer id and pass
//url=/customer/:cust_id/transaction
app.get("/customer/:cust_id/pass/transaction/:tran_pass",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let cust_id=parseInt(request.params.cust_id);
            let tran_pass=request.params.tran_pass
            let db=client.db("banking-app");
            db.collection("Account").findOne({customer_id:cust_id}).then((doc)=>{
                if(doc!=null){
                    const securePassword =  async(Tran_pass,db_pass)=>{
                        let passwordMatch=await bcrypt.compare(Tran_pass,db_pass);
                        //console.log(passwordMatch)
                        if(passwordMatch==true){
                            response.status(200).json(doc)
    
                        }else {
                            response.status(404).json({"message":`password is wrong`})
                        }
                    }
                    securePassword(tran_pass,doc.password);
                    
                }else{
                    response.status(404).json({"message":`Please enter correct password`})
                }
            })
        }
    })
})

//d)	Update transaction  password using customer id
//url=/customer/:cust_id/:trans_pass
app.put("/customer/:cust_id/:trans_pass",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let cust_id=parseInt(request.params.cust_id);
            let pass=request.params.trans_pass;
            let db=client.db("banking-app");
            const securePassword = async (cust_id,pass)=>{
                let passwordHash= await bcrypt.hash(pass, 10);
                //console.log(passwordHash);
                db.collection("Account").updateOne({customer_id:cust_id},{$set:{password:passwordHash}}).then((doc)=>{
                    response.status(200).json(doc);
                    client.close();
                })
                
            }

            securePassword(cust_id,pass)
        }
    })
})

/**
 * @swagger
 * /customer/{cust_id}/transaction/old_pass/change_pass/{new_pass}:
 *  put:
 *    tags:
 *      - Update ID params
 *    description: Update by Id
 *    parameters:
 *         - name: cust_id
 *           description: Cust Id get by 
 *           in: path
 *           type: integer
 *           required: true
 *         - name: new_pass
 *           description: new password get by 
 *           in: path
 *           type: string
 *           required: true
 *         - name: reqBody
 *           description: request body
 *           in: body
 *           schema: 
 *              type: object
 *              properties:
 *                  pass:
 *                     type: string
 *              required:
 *                  - pass
 *    responses:
 *      '200':
 *          description: A successful response
*/

//a)	Update Transaction password transaction old and new password using customer id and old password
//url=/customer/:cust_id/transaction/old_pass/change_pass/:new_pass
app.put("/customer/:cust_id/transaction/old_pass/change_pass/:new_pass",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let cust_id=parseInt(request.params.cust_id);
            let old_pass=request.body.pass
            let new_pass=request.params.new_pass;
            const securePassword = async (cust_id,old_pass,new_pass)=>{
                let passwordHash= await bcrypt.hash(new_pass, 10);
                //console.log(passwordHash);
                let date=new Date();
                let curr_date_time=date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
                let db=client.db("banking-app");
                db.collection("Password").updateOne({customer_id:cust_id},{$set:{old_transaction_password:old_pass, new_transaction_password:passwordHash,transaction_datetime:curr_date_time}}).then((doc)=>{
                    response.status(200).json(doc);
                    client.close();
                })
                
            }

            securePassword(cust_id,old_pass,new_pass)
        }
    })
})


/**
 * @swagger
 * /customer/{cust_id}/{pass}:
 *  get:
 *    tags:
 *      - Get ID params
 *    description: Update by Id
 *    parameters:
 *         - name: cust_id
 *           description: Cust Id get by 
 *           in: path
 *           type: integer
 *           required: true
 *         - name: pass
 *           description: Password get by 
 *           in: path
 *           type: string
 *           required: true
 *    responses:
 *      '200':
 *          description: A successful response
*/

//Customer Login Service
app.get("/customer/:cust_id/:pass" , async(request , response) =>{
    let cust_id = parseInt(request.params.cust_id);
    let pass = request.params.pass;
    mongoClient.connect(dbURL , {useNewUrlParser: true} , (error , client) =>{
        if(error) {
            throw error;
        }else {
            let db = client.db("banking-app");
            db.collection("Customer").findOne({_id:cust_id})
            .then((doc) => {
                if (doc!=null) {
                    const securePassword =  async(login_pass,db_pass)=>{
                        let passwordMatch=await bcrypt.compare(login_pass,db_pass);
                        //console.log(passwordMatch)
                        if(passwordMatch==true){
                            response.status(200).json(doc)
    
                        }else {
                            response.status(404).json({"message":`password is wrong`})
                        }
                    }
                    securePassword(pass,doc.password);
                    
                }else{
                    response.status(404).json({"message":`sorry id or password is wrong`} )
                }
                client.close();
            });
        }
    });
});

//Customer using customer id
app.get("/cust/:cust_id" , async(request , response) =>{
    let cust_id = parseInt(request.params.cust_id);
    let pass = request.params.pass;
    mongoClient.connect(dbURL , {useNewUrlParser: true} , (error , client) =>{
        if(error) {
            throw error;
        }else {
            let db = client.db("banking-app");
            db.collection("Customer").findOne({_id:cust_id})
            .then((doc) => {
                if (doc!=null) {
                    response.status(200).json(doc)
                    
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
    let new_pass = request.params.new_pass;
    mongoClient.connect(dbURL , {useNewUrlParser:true} , (error , client) =>{
        if(error) {
            throw error;
        }else{
            let db = client.db("banking-app");
            const securePassword = async (cust_id,new_pass)=>{
                let passwordHash= await bcrypt.hash(new_pass, 10);
                //console.log(passwordHash)
                db.collection("Customer").updateOne({_id:cust_id},{$set:{password:passwordHash}})
                .then((doc) => {
                response.json(doc);
                client.close();  
                });
            }

            securePassword(cust_id,new_pass);

        }
    });
});

//Update customer password customer old and new password using customer id and old password
app.put("/customer/:cust_id/:old_pass/change_pass/:new_pass" , (request , response) => {
    let cust_id = parseInt(request.params.cust_id);
    let old_pass = request.body.pass;
    console.log(old_pass)
    let new_pass = request.params.new_pass;
   
    mongoClient.connect(dbURL , {useNewUrlParser:true} , (error , client) => {
        if(error) {
            throw error;
        }else {
            let db= client.db("banking-app");
            const securePassword = async (cust_id,old_pass,new_pass)=>{
                let passwordHash= await bcrypt.hash(new_pass, 10);
                console.log(passwordHash);
                let date=new Date();
                let curr_date_time=date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
                db.collection("Password").updateOne({customer_id:cust_id },{$set:{old_login_password:old_pass,new_login_password:passwordHash,login_datetime:curr_date_time}})
                .then((doc) => {
                    response.json(doc);
                    client.close();
    
                });
    
            }

            securePassword(cust_id,old_pass,new_pass)
        }
    });
});
//create the services for Banking application

   
        //get Transaction detail on basis of account_num_sender
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

                ///get Transaction detail on basis of account_id_receiver
       
                app.get("/customer/cust_id/transaction/account_receiver/:account_id_receiver", (request, response) => {
                    // connect(url, parser, callback)
                        let account_num_receiver = parseInt(request.params.account_id_receiver);
                        mongoClient.connect(dbURL, {useNewUrlParser:true}, (error, client) => {
                            if(error) {
                                throw error;
                            } else {
                                let db = client.db("banking-app");
                                let users=[]
                                let cursor=db.collection("Transaction").find({account_num_receiver : account_num_receiver});
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
       
        //
        app.post("/customer/transaction/:transfer_id/:account_num_sender", (request, response) => {
            mongoClient.connect(dbURL, {useNewUrlParser:true}, (error, client) => {
                if(error) {
                    throw error;
                } else {
                    let account_num_sender=parseInt(request.params.account_num_sender);
                    let transfer_id=parseInt(request.params.transfer_id)+1
                    let db = client.db("banking-app");
                    let customer= request.body;
                    let account_num_receiver=customer.account_num_receiver
                    let IFSC_code=customer.IFSC
                    let send_amount=customer.send_amount
                    let date=new Date();
                    let curr_date_time=date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
                    var val = Math.floor(1000 + Math.random() * 1000);
                    console.log(val);
                    db.collection("Transaction").insertOne({"_id": transfer_id,
                    "reference_num":val,
                    "account_num_sender" : account_num_sender,
                    "account_num_receiver" : account_num_receiver,
                    "type" : "credit",
                    "datetime" : curr_date_time,
                    "IFSC" : IFSC_code,
                    "send_amount" : send_amount
                })
                    .then((doc) => { 
                   
                     if(doc!=null){                
                            response.json(doc);    
                    }else{
                        response.json({"message":`Duplicate ${transfer_id} id found`})
                    }
                    client.close();
                })
                }
            });
        });
        
        //for get data from transaction
app.get("/transaction", (request, response) => {
    // connect(url, parser, callback)
    mongoClient.connect(dbURL, {useNewUrlParser:true}, (error, client) => {
        if(error) 
            throw error;
        let db = client.db("banking-app");
        let cursor = db.collection("Transaction").find();
        let users = [];
        //cursor.forEach(callback1, callback2)
        cursor.forEach((doc, err) => {
            if(err)
                throw err;
            users.push(doc);
        }, () => {
            response.json(users);
            client.close();
        });
    });
});

/**
 * @swagger
 * /cust/{id}:
 *  delete:
 *    tags:
 *      - Delete ID params
 *    description: delete by Id
 *    parameters:
 *         - name: id
 *           description: Id get by 
 *           in: path
 *           type: integer
 *           required: true
 *    responses:
 *      '200':
 *          description: A successful response
*/

app.delete('/cust/:id',(req,res)=>{
    res.status(200).json({
        deletId:req.params.id
    })
})