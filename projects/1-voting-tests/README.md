# ⚡️ Projet - Système de vote 2

## Enoncé

### [Projet #2](https://formation.alyra.fr/products/developpeur-blockchain/categories/2149101531)

* Repartir du défi [“Système de vote”](https://formation.alyra.fr/products/developpeur-blockchain/categories/2149052575/posts/2153025072) !
* [Lien du contrat à tester](https://github.com/lecascyril/CodesRinkeby/blob/main/voting.sol)

Depuis la dernière version, vous avez vu la partie CI/CD avec les tests et le déploiement.

* Fournir les tests unitaires de votre smart contract
* coverage à 100% du smart contract non necessaire mais veiller à bien tester les différentes possibilités de retours (`event`,                                  `revert`)

### A rendre

* [ ] Lien Github (tests et explication rapide de ce qui a été fait dans un `readme.md`)

---

## Explications

Le dossier de test est divisé en plusieurs fichiers:

### Voting.js

Comporte les tests generaux de chaque fonction et explore les differents cas d'usage.

### status.js

Comporte les tests relatifs au `WorkflowStatus` dans lesquels les fonctions testées peuvent etre appellées

### modifiers.js

Comporte les tests des mofidiers appliqués aux fonctions testées

### utils.js

Fichier regroupant des utilitaires pur faciliter les tests en eviter ceratines repetitions dans le code

### staging.js

Ce fichier test le workflow complet du contrat
