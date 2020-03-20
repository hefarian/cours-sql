# Indexation

Dans une base de données relationelle, une table est une liste de lignes divisées en colonnes. Chaque ligne possède un identifiant unique appelé `ROWID` qui permet de la localiser et d'y accéder. Une table est donc une association (rowid -> ligne).

Un index est une structure complémentaire qui permet d'accélérer les recherches de données dans les tables. Il est constitué de valeurs associées à des rowid et peut être vu comme une série d'associations (ligne -> rowid).

Le type d'index le plus courant est le B-Tree (**Balanced** Tree et non pas Binary Tree), qui a une forme d'arbre équilibré. L'équilibrage signifie qu'il y a un même nombre de valeurs à traverser pour trouver les lignes que l'on cherche : les recherches sont faites en temps d'accès constant.

Les recherches de valeurs exactes (=) ou les inégalités (>, >=, <,<=) peuvent grandement bénéficier des indexes.

Dans un index, les données sont toujours triées de façon croissante.

## Fonctionnement 

Un index repose sur une seule table mais peut inclure plusieurs colonnes. Il stocke réellement des données et donc consomme de la place sur le serveur. Lorsqu'il est placé sur une colonne, l'index associe chaque valeur de la colonne aux ROWID qui la contiennent. 

## Création d'un index

Voici un exemple de syntaxe pour créer un index unique : 

```sql
CREATE UNIQUE INDEX IDX_PageAccueil
ON Fournisseur (PageAccueil);
```

Trois informations sont à spécifier : 
- Le nom de l'index 
- Le nom de la table sur laquelle repose l'index
- La liste des colonnes de l'index

Un index `UNIQUE` va bloquer l'ajout de doublons dans la table. 



### Usage de l'index par le serveur 

Lors d'une recherche de fournisseur par page d'accueil, le serveur va utiliser l'index pour trouver les lignes correspondantes : 

```sql
SELECT * 
FROM Fournisseur 
WHERE PageAccueil='http://www.capcod.eu';
```


## Index multi-colones 

Un index multi-colonnes va contenir les données de plusieurs colonnes, il est donc un peu plus polyvalent. En contrepartie, il va prendre plus de place sur le disque.

```sql
CREATE UNIQUE INDEX IDX_Client
ON Client (Societe, Ville);
```


### Usage de l'index par le serveur 

L'index sera utilisé avec des requêtes telles que : 

```sql
SELECT * 
FROM Client 
WHERE Societe='CHOPS' AND Ville='Bern';
```

```sql
SELECT * 
FROM Client 
WHERE Societe='CHOPS';
```

Par contre l'index ne sera **pas** utilisé avec : 

```sql
SELECT * 
FROM Client 
WHERE Societe='CHOPS' OR Ville='Bern';
```

```sql
SELECT * 
FROM Client 
WHERE Ville='Bern';
```


## Consultation des indexes sur une table

### Avec la commande PRAGMA

```sql
PRAGMA index_list('Fournisseur');
```


### Avec un select dans le dictionnaire 

```sql
SELECT type, name, tbl_name, sql
FROM sqlite_master
WHERE type= 'index';
```


## Suppression d'un index

La commande `DROP` permet de supprimer un index.

```sql
DROP INDEX IDX_PageAccueil;
```

## Exercices

1. Créer un index unique permettant d'améliorer la recherche d'employé par leur nom
2. Créer un index unique permettant d'améliorer la recherche d'un fournisseur par son numéro de téléphone en évitant l'insertion de doublons dans cette colonne
3. Créer un index permettant de rechercher un client par Nom et par Code postal simultanément