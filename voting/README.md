# ⚡️ [Système de vote](https://formation.alyra.fr/products/developpeur-blockchain/categories/2149052575)

Ecrire un smart contract de vote pour une petite organisation. Les électeurs, que l'organisation connaît tous, sont inscrits sur une liste blanche (whitelist) grâce à leur adresse Ethereum. Ils peuvent soumettre de nouvelles propositions lors d'une session d'enregistrement des propositions et peuvent voter sur les propositions lors de la session de vote.

* [x] Le vote n'est pas secret pour les utilisateurs ajoutés à la Whitelist
* [x] Chaque électeur peut voir les votes des autres
* [x] Le gagnant est déterminé à la majorité simple
* [x] La proposition qui obtient le plus de voix l'emporte.

## 👉 Processus de vote

I am Michele the whale 🐳 AKA "L'administrateur du vote"

* [x] 🐳 enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
* [x] 🐳 commence la session d'enregistrement de la proposition.
* [x] Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.
* [x] 🐳 met fin à la session d'enregistrement des propositions.
* [x] 🐳 commence la session de vote.
* [x] Les électeurs inscrits votent pour leur proposition préférée.
* [x] 🐳 met fin à la session de vote.
* [x] 🐳 comptabilise les votes.
* [x] Tout le monde peut vérifier les derniers détails de la proposition gagnante.

## 👉 Recommandations et exigences

Le smart contract doit:

* [x] S’appeler `Voting`
* [x] Utiliser la dernière version du compilateur
* [x] Etre déployé par 🐳
* [x] Définir les structures de données suivantes:

```solidity
struct Voter {
  bool isRegistered;
  bool hasVoted;
  uint votedProposalId;
}

struct Proposal {
  string description;
  uint voteCount;
}
```

* [x] Définir une énumération qui gère les différents états d’un vote qui sont:

```solidity
enum WorkflowStatus {
  RegisteringVoters,
  ProposalsRegistrationStarted,
  ProposalsRegistrationEnded,
  VotingSessionStarted,
  VotingSessionEnded,
  VotesTallied
}
```

* [x] Définir un `uint winningProposalId` qui représente l’id du gagnant ou une fonction `getWinner` qui retourne le gagnant.
* [x] Importer le smart contract [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) d’OpenZepplin.

* [x] Définir les événements suivants:

```solidity
event VoterRegistered(address voterAddress);
event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
event ProposalRegistered(uint proposalId);
event Voted (address voter, uint proposalId);
```

## 📌 Le formateur attends:

* [ ] Lien vers Github
