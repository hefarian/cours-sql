# Projection

Une projection est une sélection de colonnes d'une table, sur la base d'une liste d'attributs placés après le `SELECT` et séparés par une virgule.

La requête suivante permet d'avoir uniquement les noms et les prénoms des employés.

```sql
SELECT Nom, Prenom
    FROM Employe;
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
2. Lister les différents pays des clients
3. Idem en ajoutant les villes, le tout trié par ordre alphabétique du pays et de la ville
4. Lister la référence et le nom des produits de la catégorie 2 triés par prix décroissants ayant un prix strictement inférieur à 150€ et étant en stock
5. Lister les villes avec le code postal des clients en éliminant les doublons 
6. Lister le nom (renommé en `"Nom Produit"`), la quantité par unité (renommé en  `"Quantité"`) et le prix unitaire (renommé en  `"Prix"`) des produits du fournisseur 2 qui sont conditionnés en pots et qui sont disponibles.