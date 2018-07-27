var express = require("express");
var app = express();
var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Product = require("./models/products"),
    seed = require("./seedb"),
    Comment = require("./models/comment"),
    Order = require("./models/order"),
    passport =require("passport"),
    User=require("./models/user"),
    LocalStrategy = require("passport-local")

// mongoose.connect("mongodb://localhost/ecom");
mongoose.connect("mongodb://hardik:redsozpasta123@ds261040.mlab.com:61040/ecom");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seed()


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// SCHEMA SETUP
// var productSchema = new mongoose.Schema({
//   name: String,
//   image: String,
//   description: String,
//   price : String 
// });

// var Product = mongoose.model("Product", productSchema);


// var pss = [
//     {name:"Product 1",image:"http://via.placeholder.com/350x150",price:"$123",description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
//     {name:"Product 2",image:"http://via.placeholder.com/350x150",price:"$23" ,description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
//     {name:"Product 3",image:"http://via.placeholder.com/350x150",price:"$623",description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
//     ]

// pss.forEach(function(prod){
//     Product.create( prod,function(err,cproduct){
//         if(err){
//         console.log(err)
//         } 
//         else{
//             console.log(cproduct)
//         }
//     });

// });


app.get("/",function(req,res){
    
    Product.find({},function(err,allproducts){
       if(err){
           console.log(err)
       } 
       else{
           res.render("home",{products:allproducts}) 
       }
    });
//   res.render("home",{products:products}) 
});

app.get("/products/new",isLoggedIn,function(req, res) {
    res.render("new",{CurrentUser:req.user})
})


app.post("/products",isLoggedIn,function(req,res){
   var add = {
        name:req.body.name,
        image: req.body.image,
        description: req.body.description,
        price : req.body.price 
   } 
   
   Product.create(add,function(err,padd){
      if(err){
          console.log(err)
      } 
      else{
          console.log(padd)
          res.redirect("/")
      }
   });
});

// app.get("/products/:id",function(req,res){
// Product.findById(req.params.id).populate("comments").exec(function(err,foundP){
//   if(err){
//       console.log(err)
//   } 
//   else{
//       res.render("show",{product:foundP})
//   }
// });
// });


app.get("/products/:id",function(req,res){
Product.findById(req.params.id).populate("comments").exec(function(err,foundP){
   if(err){
       console.log(err)
   } 
   else{
       console.log(foundP)
       res.render("show",{product:foundP})
   }
});
});


app.get("/products/:id/comments/new",isLoggedIn,function(req, res) {
    
    Product.findById(req.params.id,function(err,fproduct){
        if(err){
            console.log(err)
        }
        else{
            res.render("com_new",{product:fproduct})
        }
    });
    
    
});


app.post("/products/:id/comments",isLoggedIn,function(req,res){
    
        var com ={
            text : req.body.comment,
            author : req.body.name
        }
        
        Product.findById(req.params.id,function(err,fproduct){
        if(err){
            console.log(err)
        }
        else{
            Comment.create(com,function(err,ccomment){
               if(err){
                   console.log(err)
               } 
               else{
                   fproduct.comments.push(ccomment)
                   fproduct.save()
                   res.redirect("/products/"+ req.params.id )
               }
            });
        }
    });
    
});

app.get("/products/:id/buy/new",function(req,res){
Product.findById(req.params.id,function(err,foundP){
   if(err){
       console.log(err)
   } 
   else{
      res.render("buy",{product:foundP})
   }
});
});

app.post("/products/:id/buy",function(req, res) {
    
    
    Product.findById(req.params.id,function(err, fproduct) {
    if(err){
        console.log(err)
    }
    else{
        var odr={
        cus_name:req.body.name,
        cus_address: req.body.address,
        cus_pincode: req.body.pincode,
        cus_phone : req.body.phone ,
        cus_product :req.params.id,
        cus_product_name:fproduct.name
    }
    
    Order.create(odr,function(err, order) {
        if(err){
            console.log(err)
        }
        else{
            console.log("========")
            console.log(order)
            res.send("Successfully Ordered")
        }
    })
    
    
    }
  });
    

});





app.get("/orderspage",isLoggedIn,function(req, res) {
    
    
    
    Order.find({},function(err,orders){
        if(err){
            console.log(err)
        }
        else{
            Product.find({},function(err, products) {
                if(err){
                    console.log(err)
                }
                else{
                    res.render("inventory",{orders:orders,products:products,CurrentUser:req.user})
                }
            })
            
            
        }
    })
    
})

// Product.findById(order.cus_product,function(err, fproduct) {
//     if(err){
//         console.log(err)
//     }
//     else{
        
//     }
// });


//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
  res.render("register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
          res.redirect("/"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
  res.render("login"); 
    // res.send("GHJ")
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/register");
}


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});