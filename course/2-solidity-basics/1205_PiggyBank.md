Exercice : Wallet en ligne
• Créer un smart contract qui permet à un utilisateur de déposer de l’ETH dessus.
• Créer une structure “wallet”
• uintbalance
• uintnumPayments
• Créer un mapping pour assigner cette structure à chaque adresse
• Créer une fonction “getTotalBalance()” qui permettra de récupérer le total d’Eth qu’il y a sur le contrat intelligent
• Créer une fonction “getBalance()” qui permettra de récupérer le total d’Eth qu’une certaine adresse (msg.sender) a sur le contrat intelligent
• Créer une fonction “withdraw(address payable _to)” qui permet à un utilisateur de retirer l’Eth qu’il a sur le contrat intelligent et de l’envoyer à une adresse “_to”
• Utiliser la fonction “(bool received, ) = _to.call{value: _amount}(""); ” et se renseigner sur son fonctionnement
