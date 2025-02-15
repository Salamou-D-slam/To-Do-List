import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;

//------------------- Définir EJS comme moteur de rendu-----------------------

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//-----------------CONNEXTION A MONGOOSE ET CREATION BDD----------------------

mongoose.connect("mongodb://localhost:27017/todolistDB")

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


    /*----ANCIENNE VERSION-----
app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems){
        res.render("list", {listTitle: "Today", newListItems: foundItems});
    });
});
   
    */
    //-----NOUVELLE VERSION-----
    
    app.get("/", async (req, res) => {
        try {
            // Recherche tous les éléments dans la collection
            const foundItems = await Item.find({});
    
            // Si la collection est vide, insère les éléments par défaut
            if (foundItems.length === 0) {
                await Item.insertMany(defaultItems);
                console.log("✅ Successfully saved default items to DB.");
                res.redirect("/"); // Redirige vers la page principale après l'insertion
            } else {
                // Si la collection n'est pas vide, affiche les éléments
                res.render("list", { listTitle: "Today", newListItems: foundItems });
            }
        } catch (err) {
            console.error("❌ Erreur lors de la récupération des éléments ou de l'insertion :", err);
            res.status(500).send("Erreur interne du serveur");
        }
    });
    



app.post("/", function(req, res) {

    const itemName = req.body.newItem;

    //--------AJOUTER UN ITEM A LA BDD DEPUIS LE SITE-------
    const item = new Item ({
        name: itemName
    });

    item.save();

    res.redirect("/");
    });



    //-------------LACEMENT DU SERVEUR-------------------

app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});