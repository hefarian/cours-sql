# Conversions


## Texte vers nombre

Il arrive que des colonnes de type texte contiennent des valeurs numériques. Dans ce cas, les fonctions de groupe (`AVG`, `SUM`, etc.) ou les calculs arithmétiques soient incorrects ou génèrent une erreur du serveur. Une conversion est nécessaire pour obtenir des résultats cohérents, la commande `CAST` permet de faire cela.

Exemple de requête qui pose problème : la colonne étant du texte, la valeur Max est 99 car c'est la valeur max du point de vue ASCII
```sql
SELECT MIN(Port), MAX(Port)
FROM Commande;
```

La conversion règle le problème de valeur lors des opérations de tri ou de recherche MIN/MAX :
```sql
SELECT MIN(CAST(Port AS REAL)), MAX(CAST(Port AS REAL))
FROM Commande;
```

### Texte vers nombre décimal
La conversion vers un nombre réel se fait de la façon suivante : 

```sql
SELECT CAST('123.4' AS REAL);
```

### Texte vers nombre entier
Pour convertir vers un nombre entier, remplacer `REAL` par `INTEGER` de la façon suivante : 

```sql
SELECT CAST('123.4' AS INTEGER);
```

### Texte vers nombre automatique
La valeur `NUMERIC` peut également être utilisée, elle convertit alors automatiquement vers un réel ou un entier en fonction de la valeur à convertir. Si un séparateur décimal est détecté, la valeur sera convertie en `REAL` sinon elle sera convertie en `INTEGER`.



## Nombre vers Texte

De manière analogue, il est parfois nécessaire de transformer une colonne numérique pour qu'elle soit utilisable comme du texte. Cette conversion est souvent faite automatiement mais utiliser la fonction `CAST` permet de contrôler ce mécanisme.

```sql
SELECT CAST('123456789' AS TEXT);
```


## Texte vers Date

La conversion de texte vers date est faite de cette façon :

```sql
SELECT CAST('2017-08-25' AS DATETIME);
```

## Exercices
1. Lister pour chaque commande le N° de commande, le code client, la date de commande et les frais de port de chaque commande, triés par Frais de port décroissants.
1.
