var mongoose = require("mongoose");
var Product = require("./models/products");
var Comment   = require("./models/comment");
 

var data = [
    {name:"Product 1",image:"http://via.placeholder.com/350x150",price:"$123",description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
    {name:"Product 2",image:"http://via.placeholder.com/350x150",price:"$23" ,description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
    {name:"Product 3",image:"http://via.placeholder.com/350x150",price:"$623",description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
    ]




function seedDB(){
Product.remove({},function(err){
   if(err){
       console.log(err)
   } 
   else{
        data.forEach(function(prod){
            Product.create( prod,function(err,cproduct){
                if(err){
                    console.log(err)
                } 
                else{
                    console.log(cproduct)
                    Comment.remove({},function(err){
                        if(err){
                            console.log(err)
                        }
                        else{
                                                Comment.create({
                        text : "Great Product",
                        author:"Someone"
                    },function(err,comment){
                       if(err){
                           console.log(err)
                       } 
                       else{
                           cproduct.comments.push(comment)
                           cproduct.save()
                           console.log("Added a comment")
                       }
                    });
                        }
                    })
                }
            });
    
        });  
   }
});
};
 
module.exports = seedDB;
