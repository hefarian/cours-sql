# Sous-requêtes 

Il est possible et souvent intéressant d'utiliser des sous-requêtes, renvoyant donc une table, dans une requête. On peut ainsi 

- éviter des jointures, pouvant être parfois longue à effectuer
- faire des calculs et utiliser le résultat dans un autre
- ...

Il est possible d'utiliser une sous-requêtes dans les clauses `SELECT`, `FROM`, `WHERE`, et `JOIN` des requêtes externes. 

## Dans la clause  `WHERE`

Il est déjà possible de comparer un attribut avec le résultat d'une requête. Ici, nous cherchons les commandes du client `"Bon app"`. On peut bien sûr réaliser cette opération avec une jointure, comme ci-dessous.

```sql
SELECT NoCom
FROM Commande NATURAL JOIN Client
WHERE Societe = "Bon app";
```

Si nous avons beaucoup de commandes et de clients, cette jointure peut prendre beaucoup de temps. On va donc chercher les commandes pour lesquelles `CodeCli` est égal à celui de l'entreprise `"Bon app"`. La sous-requête ici nous permet de retrouver cette valeur.

```sql
SELECT NoCom
FROM Commande
WHERE CodeCli = (SELECT CodeCli
                 FROM Client
                 WHERE Societe = "Bon app");
```

Dans cet exemple, la requête sur la table `Commande` est dite **externe**, la requête sur la table `Client` est appellée **sous-requête**.


## Idem mais avec plusieurs retours

Si la recherche concerne plusieurs valeurs, il faut utiliser l'opérateur `IN`, qui teste si une valeur est présente dans une liste. Ici, nous cherchons les commandes des clients français, toujours possible avec une jointure :

```sql
SELECT NoCom
FROM Commande NATURAL JOIN Client
WHERE Pays = "France";
```

Pour les mêmes raisons que précédemment, on peut choisir de ne pas faire de jointure et d'utiliser une sous-requête. Celle-ci va rechercher les code des clients français. Et la requête va rechercher les commandes pour lesquelles `CodeCli` est dans la liste renvoyée par la sous-requête.

```sql
SELECT NoCom
FROM Commande
WHERE CodeCli IN (SELECT CodeCli
                    FROM Client
                    WHERE Pays = "France");
```

## Dans les clauses `FROM` et `JOIN`

On a aussi la possibilité de faire une sous-requête dans la partie `FROM` de la requête. Ceci peut permettre de faire une restriction avant la jointure, ou de faire des calculs. 

Il est également possible d'utiliser un `SELECT` à la place d'une table dans la clause `FROM` : 

```sql
SELECT NoCom
FROM (SELECT *
        FROM Client NATURAL JOIN Commande
        WHERE Pays = "France");         
```

En reprenant l'exemple du client `"Bon app"`, on peut aussi faire la requête suivante.

```sql
SELECT NoCom
FROM Commande NATURAL JOIN 
    (SELECT * 
        FROM Client   
        WHERE Societe = "Bon app");
```

Les commandes des clients français peuvent aussi s'obtenir de cette façon.

```sql
SELECT NoCom
FROM Commande NATURAL JOIN 
    (SELECT *
        FROM Client
        WHERE Pays = "France");
```

Mais si on souhaite calculer le coût d'une commande, nous sommes obligé de passer par ce mécanisme. En effet, nous devons d'abord faire la somme des montants pour chaque produit et ajouter les frais de port au total. Il n'est pas possible de faire tout en une requête, car dans ce cas, en faisant la jointure entre `Commande` et `DetailCommande`, nous dupliquons les frais de port par autant de fois qu'il y a de produits différents dans la commande. Pour le faire proprement, il faut donc réaliser la commande suivante.

```sql
SELECT NoCom, Port + TotalProd AS Total
FROM Commande NATURAL JOIN
    (SELECT NoCom, 
            SUM(PrixUnit * Qte * (1 - Remise)) AS TotalProd
        FROM DetailCommande
        GROUP BY NoCom);
```

## Dans le `SELECT`

La syntaxe ci-dessous permet de sélectionner des données avec une jointure directement dans la clause `SELECT` de la requête principale. Cela permet parfois de pivoter des données qui sont en colonnes pour les sortir en ligne.

```sql
SELECT c.NoCom, (SELECT p.NomProd FROM Produit p where p.RefProd=c.RefProd)
FROM DetailCommande c;   
```

## Sous-requêtes corrélées

Il est possible de faire référence dans une sous-requête à une valeur de la table (ou des tables) de la requête initiale.

On peut par exemple chercher les produits pour lesquels il existe une vente (table `DetailCommande`) de celui-ci au même prix que le prix actuel (donc celui dans `Produit`).

Attention, avec cette syntaxe la requête imbriquée est exécutée pour chaque ligne renvoyée par la requête principale : les performances peuvent être décevantes !

```sql
SELECT RefProd, NomProd, PrixUnit
FROM Produit P
WHERE PrixUnit IN (SELECT PrixUnit
                    FROM DetailCommande
                    WHERE RefProd = P.RefProd);
```

## Exercices

1. Lister les employés n'ayant jamais traité de commande, via une sous-requête
1. Nombre de produits proposés par la société fournisseur `"Mayumis"`, via une sous-requête
1. Lister les clients dont le panier moyen est supérieur au panier moyen de tous les clients
1. Nombre de commandes passées par des employés sous la responsabilité de `"Patrick Emery"`
1. Lister les numéros de commande ayant un montant supérieur à au montant moyen des commandes
1. Lister les clients ayant commandé pour plus (en valeur) que le client `"HANAR"`