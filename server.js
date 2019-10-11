var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var user     =   require("./models/mongo");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});

router.route("/users")
    .get(function(req,res){
        var response = {};
        user.find({},function(err,data){
    console.log(data);
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            
            }

            res.json(response);
        });
    })
    .post(function(req,res){
       
        var db = new user();
        var response = {};
  
        db.userEmail = req.body.userEmail;

        db.userPassword =  require('crypto')
                          .createHash('sha1')
                          .update(req.body.userPassword)
                          .digest('base64');
        db.save(function(err){
   
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });

    router.route("/users/:id")
    .get(function(req,res){
        var response = {};
        user.findById(req.params.id,function(err,data){
     
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
    .put(function(req,res){
        var response = {};

        user.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
     
                if(req.body.userEmail !== undefined) {
  
                    data.userEmail = req.body.userEmail;
                }
                if(req.body.userPassword !== undefined) {
    
                    data.userPassword = req.body.userPassword;
                }
  
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
    .delete(function(req,res){
        var response = {};

        user.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
       
                user.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        response = {"error" : false,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    })


app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
