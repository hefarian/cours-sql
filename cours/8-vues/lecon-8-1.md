# Vues

Une vue est un nom donné à une requête SQL qui est stocké dans la base de donneés et peut être utilisé comme une table. 
Elles permettent de : 
- décomposer des requêtes SQL en plusieurs parties réutilisables 
- de cacher la complexité d'une requête
- de masquer certaines lignes ou colonnes des tables 

Elles ajoutent un niveau d'abstraction entre les tables et les ordres `SELECT`.
Dans SQLite, les vues sont en lecture uniquement mais certains SGBD supportent les instructions de DML dans les vues.


## Syntaxe

La création d'une vue revient à créer une requête SQL stockée en base avec un nom :

```sql
CREATE [TEMP] VIEW [IF NOT EXISTS] view_name[(column-name-list)]
AS 
   select-statement;
```

Le mot clé `TEMP` permet de créer une vue temporaire qui est détruite à la fin de la session utilisateur.


## Création d'une vue

La création d'une vue se fait à l'aide d'une commande simple :

```sql
CREATE VIEW IF NOT EXISTS V_ProduitsCategories AS
SELECT RefProd, NomProd, NomCateg
	FROM Produit INNER JOIN Categorie
		ON Produit.CodeCateg = Categorie.CodeCateg;
```

Il est possible de personnaliser les noms de colonne de la vue pour qu'ils donnent plus de sens à celle-ci :

```sql
CREATE VIEW IF NOT EXISTS V_ProduitsCategories (Code, Produit, Categorie) AS
SELECT RefProd, NomProd, NomCateg
	FROM Produit INNER JOIN Categorie
		ON Produit.CodeCateg = Categorie.CodeCateg;
```

Les colonnes de la vue prennent le nom des alias de colonnes qui sont placés dans l'instruction `SELECT`.


## Usage d'une vue

La vue peut être utilisée comme n'importe quelle table dans les instructions SQL :

```sql
SELECT * FROM V_ProduitsCategories;
```


## Suppression d'une vue

La clause `IF EXISTS ` est optionelle, un message d'erreur alors affiché si on essaye de supprimer une vue n'existant pas.

```sql
DROP VIEW IF EXISTS V_ProduitsCategories;
```


## Exercices

Dans ces exercices, pensez à bien nommer les colonnes avec des Alias dans le Select, cela permet de faciliter les requêtes faites sur les vues.

1. Créer une vue nommée `"V_QteCommandes"` permettant d'afficher le nom de chaque client et le nombre de commandes qu'il a passé chaque année. Utilisez cette vue pour lister les 10 clients qui ont passé le plus de commandes.
1. Créer une vue nommée `"V_Approvisonnement"` permettant d'afficher pour chaque année et chaque fournisseur, le nom et la quantité de chaque produit vendu. Utilisez cette vue pour lister les 5 fournisseurs ayant vendu le plus de produits au global.
1. Créer une vue nommée `"V_ChiffreAffaires"` permettant d'afficher le nom de chaque client avec le chiffre d'affaires qu'il a généré chaque année. Utilisez cette vue pour chercher les trois meilleurs clients. 
1. Créer une vue nommée `"V_ProduitsVendus"` affichant pour chaque année et pour chaque mois le montant des commandes (hors remise)
1. Créer une vue nommée `"V_CodeClient"` qui affiche pour chaque client sa société et un identifiant basé sur les trois premiers caractères du champ `Societe` combinés avec les cinq premiers chiffres d'un nombre aléatoire produit par la fonction `RANDOM()`. Attention, `RANDOM()` renvoie parfois un code négatif et cela n'est pas souhaitable.