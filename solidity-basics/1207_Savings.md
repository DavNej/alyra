Faire un compte d’épargne sur la blockchain!
On a le droit de transférer au contrat intelligent de l’argent quand on le souhaite
• Ajouter un admin au déploiement du contrat. (Owner, Héritage, Import, Is)
• Ajouter la condition suivante : l'admin ne peut récupérer les fonds qu'après 1 minute après la
première transaction (block.timestamp)
• On peut évidemment rajouter de l’argent sur le contrat régulièrement. Faire une fonction pour ça, et garder un historique (simple, d’un numéro vers une quantité) des dépôts dans un mapping.
• Utiliser un modifier onlyOwner
