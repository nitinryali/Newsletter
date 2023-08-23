
const express= require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https= require("https");
const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post('/',function(req,res){
    const name1=req.body.fname;
    const name2=req.body.lname;
    const email=req.body.mail;
    var data= {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:name1,
                    LNAME:name2
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/c86e9801bc";
    const options = {
        method:"POST",
        auth: "Nitin:"+mailchimpApiKey
    };
    const request = https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }


        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
});

app.post('/failure',function(req,res){
    res.redirect('/');
})
     
app.listen(process.env.PORT||3000,function(){
    console.log("server started at port 3000");
});

// c86e9801bc
