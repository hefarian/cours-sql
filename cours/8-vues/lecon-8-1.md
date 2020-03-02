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


## Usage d'une vue

La vue peut être utiliser comme n'importe quelle table dans les instructions SQL :

```sql
SELECT * FROM V_ProduitsCategories;
```


## Suppression d'une vue

La clause `IF EXISTS ` est optionelle, un message d'erreur alors affiché si on essaye de supprimer une vue n'existant pas.

```sql
DROP VIEW IF EXISTS V_ProduitsCategories;
```


## Exercices

1. Créer une vue nommée `"V_ChiffreAffaires"` permettant d'afficher le nom de chaque client, le nombre de commandes et le chiffre d'affaires qui a généré chaque année 
2. Créer une vue une vue nommée `"V_Approvisonnement"` permettant d'afficher le code, le nom, la quantité en commande de chaque produit avec le nom de son fournisseur. La vue ne doit afficher que les produits dont la quantité commandée est supérieure à 0.
