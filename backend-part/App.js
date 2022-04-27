let express=require("express");
let cors=require("cors");
let mongoClient=require("mongodb").MongoClient;
let parser=require("body-parser");
const { request } = require("http");
const { response } = require("express");

let app=express();

let dbURL="mongodb://localhost:27017";

let port=3002;

app.listen(port,()=>console.log(`Server running in ${port}`));

app.use(parser.json());

app.use(cors());
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

//b)	Update balance on basis of account number (Once the amount is transferred to anyone’s account the amount in the destination account table should also be updated as a total amount the account has. Store the date, bankid and IFSC when the transaction happens accordingly)
//Sender  url=/customer/:cust_id/:account_no/reduce_balance/:balance
app.put("/customer/:cust_id/:account_no/reduce_balance/:balance",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let cust_id=parseInt(request.params.cust_id);
            let account_no=parseInt(request.params.account_no);
            let balance=parseInt(request.params.balance);
            let db = client.db("banking-app");
            db.collection("Account").updateOne({customer_id:cust_id,_id:account_no},{$inc:{main_balance:-balance}}).then((doc)=>{
                response.status(200).json(doc);
                client.close();
            })
        }
    })
})

//b)	Update balance on basis of account number (Once the amount is transferred to anyone’s account the amount in the destination account table should also be updated as a total amount the account has. Store the date, bankid and IFSC when the transaction happens accordingly)
//2)Receiver url= /customer/:account_no/:ifsc/increase _balance/:balance
app.put("/customer/:account_no/:ifsc/increase_balance/:balance",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let account_no=parseInt(request.params.account_no);
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

//c)	Get transaction password using customer id
//url=/customer/:cust_id/transaction
app.get("/customer/:cust_id/transaction",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let cust_id=parseInt(request.params.cust_id);
            let db=client.db("banking-app");
            db.collection("Account").findOne({customer_id:cust_id}).then((doc)=>{
                if(doc!=null){
                    let pass=doc.password;
                    response.status(200).json(pass);
                }else{
                    response.status(404).json({"message":`Sorry ${cust_id} doesn't exist`})
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
            db.collection("Account").updateOne({customer_id:cust_id},{$set:{password:pass}}).then((doc)=>{
                response.status(200).json(doc);
                client.close();
            })
        }
    })
})

//a)	Update password transaction old and new password using customer id and old password
//url=/customer/:cust_id/transaction/:old_pass/change_pass/:new_pass
app.put("/customer/:cust_id/transaction/:old_pass/change_pass/:new_pass",(request,response)=>{
    mongoClient.connect(dbURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            throw error
        } else{
            let cust_id=parseInt(request.params.cust_id);
            let old_pass=request.params.old_pass;
            let new_pass=request.params.new_pass;
            let db=client.db("banking-app");
            db.collection("Password").updateOne({customer_id:cust_id},{$set:{old_transaction_password:old_pass, new_transaction_password:new_pass,transaction_datetime:new Date().toUTCString()}}).then((doc)=>{
                response.status(200).json(doc);
                client.close();
            })
        }
    })
})