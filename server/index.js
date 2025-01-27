import express, { Router } from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Optionnel : pour les requêtes Cross-Origin  
import { WebSocketServer } from 'ws'; // Corrigé
import http from 'http'; // Importer le module http

const app = express();
const PORT = process.env.PORT || 3000;
const JSON_SERVER_URL = "http://localhost:3001";

// Middleware to parse JSON bodies  
app.use(express.json());
app.use(cors()); // Utilisez CORS si nécessaire  

// Basic route  
app.get('/', (req, res) => {
    res.send('Hello World with ESNext!');
});

// Les routes pour le dish  
const dishRoute = Router();

dishRoute.get("/", async (req, res) => {
    try {
        const response = await fetch(`${JSON_SERVER_URL}/plats`);
        const responseCategorie = await fetch(`${JSON_SERVER_URL}/categorie`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        if (!responseCategorie.ok) {
            throw new Error(`Network response was not ok: ${responseCategorie.statusText}`);
        }
        const dataCategorie = await responseCategorie.json();

        // console.table(dataCategorie);

        const dataDish = await response.json(); // Traitez la réponse JSON ici  
        const data = dataDish.map(dt => ({
            ...dt,
            category: dataCategorie.find(c => Number(c.id) === dt.category)
        }));

        res.json({ data, message: "Tous les plats", error: false }); // Renvoie les données sous forme de JSON  
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Internal Server Error'); // Gestion des erreurs  
    }
});

dishRoute.get('/category', async (req, res) => {
    try {
        const responseCategorie = await fetch(`${JSON_SERVER_URL}/categorie`);
        if (!responseCategorie.ok) {
            throw new Error(`Network response was not ok: ${responseCategorie.statusText}`);
        }
        const dataCategorie = await responseCategorie.json();
        res.json({ data: dataCategorie, message: "Tous les catégories", error: false });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Internal Server Error'); // Gestion des erreurs  
    }
});

dishRoute.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await fetch(`${JSON_SERVER_URL}/plats/${id}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        res.json({ data, message: "Détails du plat", error: false }); //
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(404).send('Not Found'); // Gestion des erreurs
    }
});

dishRoute.post('/', async (req, res) => {
    try {
        let body = req.body;
        if (body.name && body.price && body.category && body.description) {
            body.status = body.status || 'REGULAR';
            body.imageUrl = body.imageUrl || 'assets/images/default-dish.png';
            body.availlable = body.availlable || false;
        }
        const responsePlat = await fetch(`${JSON_SERVER_URL}/plats`);
        if (responsePlat.ok)
            body.id = String((await responsePlat.json()).length + 1);
        body.category = parseInt(body.category.id);
        if (body.status == 'DAILY') {
            await udpateDishDaily(body);  // Attendre la mise à jour des plats avec la fonction udpateDishDaily  
        }

        const response = await fetch(`${JSON_SERVER_URL}/plats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        res.json({
            data, message: "Le plat a été ajouté avec succès", error:
                false
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Internal Server Error'); // Gestion des erreurs
    }
});


dishRoute.put('/:id', async (req, res) => {
    const id = req.params.id;
    let body = req.body;

    // Vérification si "category" est présent et a la structure attendue  
    if (!body.category || !body.category.id) {
        return res.status(400).json({ message: "Category is required", error: true });
    }

    // Mise à jour du champ "category"  
    body.category = parseInt(body.category.id);

    try {
        if (body.status == 'DAILY') {
            // Attendre la mise à jour des plats avec la fonction udpateDishDaily  
            await udpateDishDaily(body);
        }

        // Mise à jour du plat spécifique  
        const response = await fetch(`${JSON_SERVER_URL}/plats/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.message || "Failed to update the dish", error: true });
        }

        const data = await response.json();
        res.json({
            data,
            message: "Le plat a été modifié avec succès",
            error: false,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Internal Server Error'); // Gestion des erreurs  
    }
});


dishRoute.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await fetch(`${JSON_SERVER_URL}/plats/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        res.json({
            data, message: "Le plat a été supprimé avec succès", error:
                false
        });
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Internal Server Error'); // Gestion des erreurs
    }
});



// Les routes pour le order ou commandes  
const orderRoute = Router();

orderRoute.get('/', async (req, res) => {
    try {
        const commandesResponse = await fetch(`${JSON_SERVER_URL}/commandes`);
        if (!commandesResponse.ok) {
            throw new Error('Erreur lors de la récupération des commandes.');
        }
        const commandes = await commandesResponse.json();
        res.json({
            data: commandes,
            message: "Les commandes ont été récupérées avec succès",
            error: false,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des commandes.",
            error: true,
        });
    }
});

orderRoute.get("/details", async (req, res)=>{
    try {
        const commandesResponse = await fetch(`${JSON_SERVER_URL}/commandes`);
        if (!commandesResponse.ok) {
            throw new Error('Erreur lors de la récupération des commandes.');
        }
        const commandes = await commandesResponse.json();
        // Traitement des commandes et des plats associés
        const commandesWithDishes = await Promise.all(
            commandes.map(async cmd=>await getUserFormOrder(await getDishCategory(cmt)))
        );
        res.json({
            data: commandesWithDishes,
            message: "Les commandes ont été récupérées avec succès",
            error: false,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des commandes.",
            error: true,
        });
    }
});


orderRoute.get("/:id/details", async (req, res)=>{
    try {
        const commandeId = req.params.id;
        const commandesResponse = await fetch(`${JSON_SERVER_URL}/commandes/${commandeId}`);
        if (!commandesResponse.ok) {
            throw new Error('Erreur lors de la récupération des commandes.');
        }
        const commandes = await getUserFormOrder(await getDishCategory(await commandesResponse.json()));
        res.json({
            data: commandes,
            message: "Les commandes ont été récupérées avec succès",
            error: false,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des commandes.",
            error: true,
        });
    }
});

orderRoute.get("/:id", async (req, res)=>{
    try {
        const commandeId = req.params.id;

        console.log(commandeId)
        const commandesResponse = await fetch(`${JSON_SERVER_URL}/commandes/${commandeId}`);
        if (!commandesResponse.ok) {
            throw new Error('Erreur lors de la récupération des commandes.');
        }
        const commandes = await commandesResponse.json();
        res.json({
            data: commandes,
            message: "Les commandes ont été récupérées avec succès",
            error: false,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des commandes.",
            error: true,
        });
    }
});



async function getOrderWithDish(commande) {
    const dishesWithDetails = await Promise.all(
        commande.dishes.map(async (item) => {
            try {
                const platResponse = await fetch(`${JSON_SERVER_URL}/plats/${item.id}`);

                if (!platResponse.ok) {
                    throw new Error(`Erreur lors de la récupération du plat ID ${item.id}`);
                }
                const dish = await getDishCategory(await platResponse.json());
                return { dish, quantity: item.quantity };
            } catch (err) {
                console.error(`Erreur pour le plat ID ${item.id}:`, err);
                return null; // Si une erreur se produit, retourner null
            }
        })
    );

    // Filtrer les plats valides
    commande.dishes = dishesWithDetails.filter((dish) => dish !== null);

    return commande;
}

async function getDishCategory(dish) {
    try {
        const categoryResponse = await fetch(`${JSON_SERVER_URL}/categorie/${dish.category}`);
        if (!categoryResponse.ok) {
            throw new Error(`Erreur lors de la récupération du plat avec la catégori ID ${dish.category}`);
        }
        dish.category  = await categoryResponse.json();
        return dish;
    } catch (err) {
        console.error(`Erreur pour le plat avec la catégorie ID ${item.category}:`, err);
        return dish; // Si une erreur se produit, retourner null
    }
}


async function getUserFormOrder(order){
    try{
        const userResponse = await fetch(`${JSON_SERVER_URL}/users/${order.clientId}`);
        if (!userResponse.ok) {
            throw new Error(`Erreur lors de la récupération du user ${dish.category}`);
        }
        order.client  = await userResponse.json();
        return order;
    }catch(err){
        console.error(err);
        return order;
    }
}

async function udpateDishDaily(data) {
    const status = 'DAILY';
    return new Promise(async (resolve, reject) => {
        try {
            if (data.status === status) {
                const response = await fetch(`${JSON_SERVER_URL}/plats?status=${status}`);
                const plats = await response.json();

                // Utiliser Promise.all pour attendre toutes les mises à jour  
                const updatePromises = plats.map(async (dt) => {
                    dt.status = 'REGULAR';
                    const updateResponse = await fetch(`${JSON_SERVER_URL}/plats/${dt.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dt),
                    });
                    return updateResponse.ok; // Retourner le statut de la réponse  
                });

                // Attendre que toutes les promesses soient résolues  
                const results = await Promise.all(updatePromises);
                console.log(results);
                resolve(results); // Résoudre la promesse finale avec les résultats  
            } else {
                resolve([]); // Résoudre immédiatement si le statut ne correspond pas  
            }
        } catch (error) {
            reject(error); // Rejeter la promesse en cas d'erreur  
        }
    });
}


app.use("/api/dish", dishRoute);
app.use("/api/order", orderRoute);


// Create an HTTP server
const server = http.createServer(app); // Create server from the Express app

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    }
});

// Create WebSocket server
const wss = new WebSocketServer({ server }); // Corrigé

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server  
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
