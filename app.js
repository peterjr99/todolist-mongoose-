const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
const _ = require("lodash");

const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});

mongoose.set("strictQuery", true);





const itemSchema = new mongoose.Schema ({
    name : String
     
})

const Item = mongoose.model( "Item", itemSchema);

const item1 = new Item ({
    name : "welcome to your todo list"
})

const item2 = new Item ({
    name : "hit the + button to add a new item"
})

const item3 = new Item ({
    name : "<-- Hit this to delete an item"
}) 

const defaultItem = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema)




app.get("/", function(req, res){

Item.find({},function(err,founditems){

if (founditems.length === 0){
Item.insertMany(defaultItem, function(err){
    if (err){
        console.log(err)
    }else{
        console.log("successfully insert default item")
    }
    res.redirect("/")
})

}else{
    res.render("list",{listTitle: "today", newListItems: founditems})

}

      
});
})
    
   
    

app.post('/', function(req, res){

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today"){
        item.save()
        res.redirect("/")
    }else{
        List.findOne({name:listName}, function(err, foundList){
            foundList.items.push(item)
            foundList.save();
            res.redirect("/" + listName);
        })
    }

    
      
})

app.post("/delete", function(req,res){
    const checkedItemId = (req.body.checkbox)
    const listName = req.body.listName;

    if(listName === "Today"){

        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("successfully deleted")
                res.redirect("/")
            }
                })

    }else{
        List.findOneAndUpdate({
            name: listName
          },
          {
            $pull: {
              items: {
                _id: checkedItemId
              }
            }
          },
          function(err, foundList) {
            if (!err) {
              res.redirect("/" + listName)
            }
          })
      }
    
});



app.get("/:customListName", function(req,res){
    const customListName = req.params.customListName

List.findOne({name:customListName}, function(err,foundList){
    if(!err){
         if(!foundList){

            const list = new List ({
                name: customListName,
                items: defaultItem
            });

            list.save();
            res.redirect("/" + customListName);
         }else{
              res.render("list", {listTitle: foundList.name, newListItems: foundList.items})


         }


    }





})

})
        










app.post('/work', function(req, res){
    let item = req.body.newItem
    workItems.push(item)
    res.redirect("/work")
})

app.get("/about", function(req,res){
    res.render('about')
})



app.listen(3000, function(){
    console.log("server started on port 3000")
})