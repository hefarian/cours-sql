# Fonctions diverses

Il existe des fonctions utiles pour manipuler les valeurs nulles que l'on trouve dans les tables. Nous allons voir `IFNULL()` pour remplacer les valeurs nulles par un autre, `NULLIF()` pour remplacer une valeur par un null.

## Remplacement de valeurs nulles

La fonction `IFNULL()` va remplacer une valeur nulle par une valeur de notre choix. Ici nous remplaçons le numéro du Manager par le libellé `"Personne"` si la valeur est nulle.

```sql
SELECT Nom, Prenom, IFNULL(RendCompteA, 'Personne')  
FROM Employe;
```

## Suppression de valeurs 

A l'inverse, la fonction `NULLIF()` permet de remplacer une valeur par un `NULL`. La requête suivante remplace les Titres `"Dr."` par un null.

```sql
SELECT Nom, Prenom, NULLIF(TitreCourtoisie,'Dr.') FROM Employe;
```

## Exercices

1. 