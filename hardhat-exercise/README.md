# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

## EXERCICE

* Créer un contrat intelligent qui permet de dire "Hello" + prenom grâce à une function `sayHello()`
* Le prénom est passé directement en argument du constructeur
* Créer un setter et un getter pour le prénom
* Utiliser la librairie "Ownable" de OpenZeppelin pour le setter et ajouter cette librairie au projet ("yarn add ? :o")
* Déployer sur Goerli et Vérifier le contrat sur Etherscan
* Utiliser Etherscan pour "jouer" avec le contrat
