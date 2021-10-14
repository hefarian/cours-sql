# Projection

Une projection est une sélection de colonnes d'une table, sur la base d'une liste d'attributs placés après le `SELECT` et séparés par une virgule.

La requête suivante permet d'avoir uniquement les noms et les prénoms des employés.

```sql
SELECT Nom, Prenom
FROM Employe;
```

## Projections et calculs

Il est tout à fait possible de mélanger projections et calculs dans une requête SQL

```sql
SELECT DateCom, Port, Port * 2 
FROM Commande;
```


## Doublons

Lors d'une projection, on est souvent en présence de doublons dans les résultats, i.e. deux lignes ou plus identiques.

Par exemple, lorsqu'on liste les fonctions des employés, on a plusieurs fois chaque fonction existante.

```sql
SELECT Fonction
FROM Employe;
```

Or, dans ce cas, on est souvent intéressé par la liste des valeurs uniques. Pour l'obtenir, il est possible d'ajouter le terme **`DISTINCT`** juste après le `SELECT`, pour supprimer ces doublons.

```sql
SELECT DISTINCT Fonction
FROM Employe;
```

Ceci fonctionne aussi lorsqu'on a indiqué plusieurs attributs dans le `SELECT`.

## Renommage

Pour améliorer la présentation, il est possible de renommer un attribut (et on le verra plus tard le résultat de calcul), avec le terme **`AS`** placé après l'attribut à renommer et suivi du nouveau nom.

```sql
SELECT DISTINCT Fonction AS "Fonctions existantes"
FROM Employe;
```

## Exercices

1. Lister uniquement la description des catégories de produits (table `Categorie`)
1. Lister les différents pays des clients
1. Idem en ajoutant les villes, le tout trié par ordre alphabétique du pays et de la ville
1. Lister les villes avec le code postal des clients en éliminant les doublons 