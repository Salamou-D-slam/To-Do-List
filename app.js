import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;

//------------------- DEFINIR EJS COMME MOTEUR DE RENDU-----------------------

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

//----LES RANGER DANS UN TABLEAU ARRAY----

const defaultItems = [item1, item2, item3];

const listScema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("List", listScema);


//------------------------------ GET ROUTE---------------------------------

    
    app.get("/", async (req, res) => {
        try {
            // RECHERCHE TOUS LES ÉLÉMENTS DANS LA COLLECTION
            const foundItems = await Item.find({});
    
            // SI LA COLLECTION EST VIDE, INSÈRE LES ÉLÉMENTS PAR DÉFAUT
            if (foundItems.length === 0) {

                //INSERT MANY
                await Item.insertMany(defaultItems);
                console.log("✅ Éléments par défaut enregistrés avec succès dans la base de données.");
                res.redirect("/"); // REDIRIGE VERS LA PAGE PRINCIPALE APRÈS L'INSERTION
            } else {
                // SI LA COLLECTION N'EST PAS VIDE, AFFICHE LES ÉLÉMENTS
                res.render("list", { listTitle: "Today", newListItems: foundItems });
            }
        } catch (err) {
            console.error("❌ Erreur lors de la récupération des éléments ou de l'insertion :", err);
            res.status(500).send("Erreur interne du serveur");
        }
    });
    
    app.get("/:customListName", async (req,res) => {

        const customListName = req.params.customListName;

        const foundList = await List.findOne({ name: customListName });
                
            if (!foundList) {
                //CREER UNE NOUVELLE LISTE
                const list = new List ({
                    name: customListName,
                    items: defaultItems
                });    
                
                 list.save();
                 res.redirect("/" + customListName);
   
            } else {
                //MONTRER LES LISTES EXISTANTES 
                res.render("List", { listTitle: foundList.name, newListItems: foundList.items });
            }

        

      

    });

    app.get("/about", async (req,res) => {
        res.render("about");
    });

//----------------------------------------POST ROUTE---------------------------------

        //----------------AJOUT DE NOUVEAU ITEM ----------------------
    app.post("/", async (req, res) => {
        try {
            // RÉCUPÉRER LE NOM DE L'ÉLÉMENT ENVOYÉ PAR LE FORMULAIRE
            const itemName = req.body.newItem;
    
            // CRÉER UN NOUVEL ÉLÉMENT AVEC LE NOM FOURNI
            const item = new Item({
                name: itemName
            });
    
            // SAUVEGARDER L'ÉLÉMENT DANS LA BASE DE DONNÉES
            await item.save();
    
            // REDIRIGER VERS LA PAGE PRINCIPALE APRÈS L'AJOUT
            res.redirect("/");
        } catch (err) {
            // GÉRER LES ERREURS ET AFFICHER UN MESSAGE DANS LA CONSOLE
            console.error("❌ ERREUR LORS DE L'AJOUT DE L'ÉLÉMENT :", err);
            
            // ENVOYER UNE RÉPONSE D'ERREUR AU CLIENT
            res.status(500).send("ERREUR INTERNE DU SERVEUR");
        }
    });
    
            //--------------------SUPPRESSION D'ITEM----------------------
    app.post("/delete", async (req, res) => {
        try {
            const checkedItemId = req.body.checkbox;
            
            const deletedItem = await Item.findByIdAndDelete(checkedItemId);
            
            if (deletedItem) {
                console.log("Successfully deleted checked item.");
            } else {
                console.log("Item not found.");
            }
            
            res.redirect("/"); // Rediriger après suppression
        } catch (err) {
            console.error("Error deleting item:", err);
            res.status(500).send("Internal Server Error");
        }
    });





    //-------------LACEMENT DU SERVEUR-------------------

app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});