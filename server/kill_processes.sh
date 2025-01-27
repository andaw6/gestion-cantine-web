#!/bin/bash  

# Définir les ports à vérifier  
PORTS=(3000 3001)  

# Fonction pour tuer les processus sur un port donné  
kill_process_on_port() {  
    local port=$1  
    # Trouver le PID du processus utilisant le port  
    local pid=$(lsof -t -i:$port)  

    if [ -z "$pid" ]; then  
        echo "Aucun processus écoutant sur le port $port."  
    else  
        echo "Tuer le processus $pid écoutant sur le port $port."  
        kill "$pid"  
        echo "Processus $pid a été arrêté."  
    fi  
}  

# Boucle à travers les ports spécifiés  
for port in "${PORTS[@]}"; do  
    kill_process_on_port "$port"  
done