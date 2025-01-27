#!/bin/bash  
./server/kill_processes.sh

# Démarre le serveur JSON Server dans un terminal de fond (en utilisant 'nohup' et '&')  
nohup npx json-server --watch ./server/data/db.json --port 3001 > ./server/log/json-server.log 2>&1 &  

# Ajoute un délai de 1 secondes avant de démarrer le serveur Node.js  
sleep 1

# Démarre le serveur Node.js avec Express dans un terminal de fond  
nohup npm run dev > ./server/log/express-server.log 2>&1 &  

# Affiche les messages indiquant que les serveurs ont démarré  
echo "JSON Server démarré sur le port 3001"  
echo "Node.js avec Express a démarré sur le port 3000"
