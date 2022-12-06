# ⚡️ [Système de vote](https://formation.alyra.fr/products/developpeur-blockchain/categories/2149052575)

Un smart contract de vote peut être simple ou complexe, selon les exigences des élections que vous souhaitez soutenir. Le vote peut porter sur un petit nombre de propositions (ou de candidats) présélectionnées, ou sur un nombre potentiellement important de propositions suggérées de manière dynamique par les électeurs eux-mêmes.

Dans ce cadres, vous allez écrire un smart contract de vote pour une petite organisation. Les électeurs, que l'organisation connaît tous, sont inscrits sur une liste blanche (whitelist) grâce à leur adresse Ethereum, peuvent soumettre de nouvelles propositions lors d'une session d'enregistrement des propositions, et peuvent voter sur les propositions lors de la session de vote.

* Le vote n'est pas secret pour les utilisateurs ajoutés à la Whitelist
* Chaque électeur peut voir les votes des autres
* Le gagnant est déterminé à la majorité simple
* La proposition qui obtient le plus de voix l'emporte.

## 👉 Processus de vote

Here is Michele the whale 🐳. She will be "L'administrateur du vote"

*  🐳 enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
*  🐳 commence la session d'enregistrement de la proposition.
*  Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.
*  🐳 met fin à la session d'enregistrement des propositions.
*  🐳 commence la session de vote.
*  Les électeurs inscrits votent pour leur proposition préférée.
*  🐳 met fin à la session de vote.
*  🐳 comptabilise les votes.
*  Tout le monde peut vérifier les derniers détails de la proposition gagnante.

## 👉 Recommandations et exigences

Le smart contract doit:

* S’appeler `Voting`
* Utiliser la dernière version du compilateur
* Etre déployé par 🐳
* Définir les structures de données suivantes:

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

* Définir une énumération qui gère les différents états d’un vote qui sont:

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

* Définir un `uint winningProposalId` qui représente l’id du gagnant ou une fonction `getWinner` qui retourne le gagnant.
* Importer le smart contract [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) d’OpenZepplin.

* Définir les événements suivants:

```solidity
event VoterRegistered(address voterAddress);
event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
event ProposalRegistered(uint proposalId);
event Voted (address voter, uint proposalId);
```

## 📌 Le formateur attends:

* Lien vers Github
