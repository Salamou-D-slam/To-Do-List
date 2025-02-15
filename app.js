import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();

app.set('view  engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//-----------------CONNEXTION A MONGOOSE ET CREATION BDD----------------------

mongoose.connect("mongodb://localhost:27017/todolistDB");

//----------------------CREATION SCHEMA----------------------------------------

const itemsSchema = {
    name: String
};

//------------------------CREATION MODEL--------------------------------------

const Item = mongoose.model("Item", itemsSchema);

//-------------------------CREATION DOCUMENTS----------------------------------

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "hit the + butoon to add a new item"
});

const item3 = new Item({
    name: "<-- hit this to delete an item"
    
});

//----------------------LES RANGER DANS UN TABLEAU ARRAY-----------------------

const defaultItems = [item1, item2, item3];

//------------------------------INSERT MANY---------------------------------

/*----ANCIENNE VERSION------
Item.insertMany(defaultItems, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully saved default items to DB.");
    }
});*/

//----NOUVELLE VERSION-----
Item.insertMany(defaultItems)
    .then(() => console.log("Successfully saved default items to DB."))
    .catch(err => console.error(err));


app.get("/", function(req, res) {
    res.render("list", {listTitle: "Today", newListItems: items});
});

app.post("/", function(req, res) {
    const item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
        }
    });
