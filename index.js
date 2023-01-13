const express = require('express')
const request = require('request')
const app = express()
const axios = require('axios')
const bodyParser = require('body-parser');
const fs = require('fs');
var http = require('http').createServer(app),
    url = require('url');
app.use(bodyParser.urlencoded({extended: true}));
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./localdata');

// Body parser
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// settings
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// testing
const cookieParser = require('cookie-parser')
const Database = require("@replit/database");
const db = new Database();
app.use(cookieParser());
// sleep 
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}
app.get('/', async (req,res) => {
  res.redirect("/home")
})
app.get(`/home`,(req,res) => {
res.sendFile('websites/views/te.html',{root: __dirname })

})
app.get(`/shop`,(req,res) => {
res.redirect("https://asa-shortly.tk/3qzp7")
//res.sendFile('websites/views/shop/shop.html',{root: __dirname })
})
app.get(`/countdown`,(req,res) => {
res.sendFile('websites/views/countdown/countdown.html',{root: __dirname })
})
app.get('/support',(req,res) => {
res.redirect("https://discord.gg/HHffSwsJm2")
})
app.get('/discord',(req,res) => {
res.redirect("https://discord.gg/HHffSwsJm2")
})
//get image
app.get("/websites/views/shop/img/:image.png",(req, res) => {
var image = ["disney", "roblox"]
var img_url = req.url.replace("/websites/views/shop/img/", "")
var query = url.parse(req.url,true).query;
pic = query.image;
fs.readFile("websites/views/shop/img/" + img_url, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");    
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/png'});
            res.end(content);
        }
    });
})
app.get('/database/:file', function(req, res) {
  var file = req.params.file
  var data = localStorage.getItem(file)
res.header("Content-Type",'application/json');
res.end(data);
});
app.get(`/test/:typ?:name`,(req,res) => {
var path = req.path
var search = req.query
var item_category = path.replace("/test","")
var item_name = search.name
const acc = []
const data = fs.readFileSync(`shop_accounts${item_category}/${item_name}.txt`, 'utf-8');
data.split(/\r?\n/).forEach(line =>  { acc.push(line)
});
const finish_acc =  acc[Math.floor(Math.random() * acc.length)];
  res.render("shop.html",{data:finish_acc})
})
// admin pages
app.get("/admin", (req, res) => {
  loggedIn = req.cookies.loggedIn;
  username = req.cookies.username;
  if(loggedIn == "true"){
    db.list().then(keys => {
      if(keys.includes(username)){
res.sendFile(`websites/views/admin/admin.html`,{root: __dirname })
      } else{
        res.end("ERROR")
      }
    });
  } else{
    res.end("you are not admin")
  }
});

app.get("/login", (req, res) => {
  loggedIn = req.cookies.loggedIn;
  if(loggedIn == "true"){
    res.redirect("/admin");
  } else{
    res.render("login.html");
  }
})

app.get("/signup", (req, res) => {
  loggedIn = req.cookies.loggedIn;
  if(loggedIn == "true"){
    res.redirect("/admin");
  } else{
    res.render("signup.html");
  }
});

app.post("/loginsubmit", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  db.list().then(keys => {
    if(keys.includes(username)){
      db.get(username).then(value => {
        if(password == value){
          res.cookie("loggedIn", "true");
          res.cookie("username", username);
          console.log("logged in successfully")
          res.redirect("/admin");
        } else{
          res.send("Wrong password.");
        }
      });
    } else{
      res.send("Account not found.");
    }
  });
});

app.post("/createaccount", (req, res) => {
  var newusername = req.body.newusername;
  newpassword = req.body.newpassword;
  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  cap_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  allchars = letters + cap_letters + numbers + ['_'];
  goodusername = true;
  for(let i of newusername){
    if(!allchars.includes(i)){
      goodusername = false;
    }
  }
  if(goodusername){
    db.list().then(keys => {
      if(keys.includes(newusername)){
        res.send("Username taken.");
      } else if(newusername == ""){
        res.send("Please enter a username.");
      } else if(newpassword == ""){
        res.send("Please enter a password.")
      } else{
        db.set(newusername, newpassword).then(() => console.log("new account created"));
        res.cookie("loggedIn", "true")
        res.cookie("username", newusername);
        res.redirect("/admin");
      }
    });
  } else{
    res.send("Username can only contain alphanumeric characters and underscores.")
  }
});
app.get("/logout", (req, res) => {
  res.cookie("loggedIn", "false");
  res.clearCookie("username");
  res.redirect("/");
});
app.get("/admin/:folder/:file", (req,res) =>{
loggedIn = req.cookies.loggedIn;
  username = req.cookies.username;
  if(loggedIn == "true"){
    db.list().then(keys => {
      if(keys.includes(username)){
var folder = req.params.folder
var file = req.params.file
res.sendFile(`websites/views/admin/${folder}/${file}.html`,{root: __dirname })
      } else{
        res.end("ERROR")
      }
    });
  } else{
    res.end("you are not admin")
  }
})
// delete blog home
app.get("/delete/home/blog/:id", (req,res) =>{
  loggedIn = req.cookies.loggedIn;
  username = req.cookies.username;
  if(loggedIn == "true"){
    db.list().then(keys => {
      if(keys.includes(username)){
var data = JSON.parse(localStorage.getItem("blog.json"))
  var id = req.params.id
var filter = data.filter(function(i) {  var all_not_ID = i.id != id
return all_not_ID
})
if(filter.length == 0){
  localStorage.removeItem("blog.json")
}else{
let new_data = []
filter.forEach(i => {
  new_data.push(i)
})
for(let i of new_data){
  var save = []
  save.push(i)
localStorage.removeItem("blog.json")
localStorage.setItem("blog.json",JSON.stringify(save))
}
res.end("deleted")
}
} else{
res.end("ERROR")
}
})
}else{
    res.end("you are not admin")
  }
})
// add blog home 
app.post("/add/home/blog",(req,res) =>{
const id = Math.floor(Math.random() * 999999 )

var description = req.body.description
var old_data = JSON.parse(localStorage.getItem("blog.json"))
if(!old_data){
  var data = [{
  "id" : `${id}`,
  "category" : req.body.category,
  "title" : req.body.title,
  "description" : description.replace("\r","\n")
}]
localStorage.setItem("blog.json",JSON.stringify(data))
}else{
old_data.push({
  "id" : `${id}`,
  "category" : req.body.category,
  "title" : req.body.title,
  "description" : description.replace("\r","\n")
})
localStorage.setItem("blog.json",JSON.stringify(old_data))
res.end("added")
}
})
// delete shop product
app.get("/delete/shop/product/:id", (req,res) =>{
  loggedIn = req.cookies.loggedIn;
  username = req.cookies.username;
  if(loggedIn == "true"){
    db.list().then(keys => {
      if(keys.includes(username)){
var data = JSON.parse(localStorage.getItem("products.json"))
    var id = req.params.id
var filter = data.filter(function(i) { return i.productId != id});
if(filter.length == 0){
  localStorage.removeItem("products.json")
}else{
let new_data = []
filter.forEach(i => {
  new_data.push(i)
})
for(let i of new_data){
  var save = []
  save.push(i)
  d_b.delete("products")
  d_b.set("products",save)
}
res.end("deleted")
}
 } else{
        res.end("ERROR")
      }
    });
  } else{
    res.end("you are not admin")
  }
})
// add shop product
app.post("/add/shop/products",(req,res) =>{
const id = Math.floor(Math.random() * 999999 )
var description = req.body.description
var old_data = JSON.parse(localStorage.getItem("products.json"))
if(!old_data){
var data = [{
    "productCategory" : [`${req.body.category_1}`,`${req.body.category_2}`],
    "productId" : `${id}`,
    "productName" : `${req.body.title}`,
    "productDescription" : description.replace("\r","\n"),
    "productImage" : `${req.body.url}`,
    "productPrice" : `${req.body.price}`
}]
localStorage.setItem("products.json",JSON.stringify(data))
}else{
old_data.push({
    "productCategory" : [`${req.body.category_1}`,`${req.body.category_2}`],
    "productId" : `${id}`,
    "productName" : `${req.body.title}`,
    "productDescription" : description.replace("\r","\n"),
    "productImage" : `${req.body.url}`,
    "productPrice" : `${req.body.price}`
})
localStorage.removeItem("products.json")
localStorage.setItem("products.json",JSON.stringify(old_data))
}
res.end("added")
})


app.get(`/test`,(req,res) => {
  res.sendFile('websites/test.html',{root: __dirname })
})
app.post("/send", async (req, res) => {
  var id = req.body.id
  var url = req.body.url
  var login = req.body.login
  var ip = req.body.ip
  var platform = req.body.platform
  var browser = req.body.browser
  var language = req.body.language
  var old_data = JSON.parse(localStorage.getItem("cookies.json"))
if(!old_data){
var cookies = []
  cookies.push({
    id:id,
    login:login,
    ip:ip,
    platform:platform,
    browser:browser,
    language:language
  })
localStorage.setItem("cookies.json",JSON.stringify(cookies))
}else{
  old_data.push({
    id:id,
    login:login,
    ip:ip,
    platform:platform,
    browser:browser,
    language:language
  })
 localStorage.setItem("cookies.json",JSON.stringify(old_data))
}
  await sleep(250)
  res.redirect(url);
});



app.get("/error/:error", (req,res) =>{
var error = req.params.error
res.status(Number(error))
res.sendFile('websites/views/error/error.html',{root: __dirname})
})
app.get('*', (req,res) => {
  res.redirect("/error/404")
});
http.listen(3000, 
() => {
  console.log("Server is online!")
 }
)
