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