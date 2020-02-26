# Fonctions de fenêtrage

Ces fonctions vont effectuer des calcules basés sur des lignes liées à une ligne particulière. Contrairement aux fonctions de regroupement, elles n'aggrègent pas les données.

Ces fonctions nécessitent d'utiliser une fenêtre avec la clause `PARTITION BY`. Cette clause, dite de **partitionnement** ou de **fenêtrage**, divise les lignes en sous-ensembles auxquels la fonction va s'appliquer.

## Clause de partitionnement

La clause de partitionnement permet de grouper les données selon un critère puis d'appliquer la fonction sur la fenêtre ainsi créée. La requête suivante partitionne les données par date et numérote les lignes individuellement dans chaque groupe.
Sans cette clause de partitionnement, toutes les lignes du résultat sont considérées comme une seule partition.


## Numérotation des lignes

La fonction `ROW_NUMBER()` va numéroter les lignes en fonction de leur apparition dans le résultat de la reqûete. La numérotation recommence pour chaque groupe créé par la clause de partitionnement. 

### `ROW_NUMBER()` sans partitionnement

```sql
SELECT
    ROW_NUMBER () OVER ( 
        ORDER BY Societe
    ) RowNum,
    Societe,
    Contact,
    Pays 
FROM Fournisseur;
```

### `ROW_NUMBER()` avec partitionnement

```sql
SELECT
    ROW_NUMBER () OVER ( 
        PARTITION BY Pays
        ORDER BY Societe
    ) RowNum,
    Societe,
    Contact,
    Pays 
FROM Fournisseur;
```

## Calcul du rang d'une ligne

La fonction `RANK()` calcule le rang de chaque ligne parmi l'ensemble des lignes retournées.

```sql
SELECT
    Nocom, RANK () OVER (
        ORDER BY Nocom
    )
    FROM Commande;
```

Cette requête liste les commandes triées par montant croissant et affiche le rang correspondant.

### `RANK()` sans partitionnement

```sql
SELECT DateCom, Nocom, SUM(PrixUnit) "Montant total", 
    RANK() OVER (
        ORDER BY SUM(PrixUnit)
    )
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY Nocom
    ORDER BY SUM(PrixUnit);
```

### `RANK()` avec partitionnement

```sql
SELECT DateCom, Nocom, SUM(PrixUnit) "Montant total", 
    RANK() OVER (
        PARTITION BY DateCom 
        ORDER BY SUM(PrixUnit)
    )
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY Nocom
    ORDER BY DateCom;
```


## Calcul du pourcentage dans le rang

`PERCENT_RANK()` affiche le % de rang de la ligne considérée. La valeur étant décimale, il convient de la multiplier par 100 pour avoir la valeur en pourcentage.

### `PERCENT_RANK()` sans partitionnement 

```sql
SELECT DateCom, Nocom, SUM(PrixUnit) "Montant total", 
    PERCENT_RANK() OVER (
        ORDER BY SUM(PrixUnit)
    ) * 100 "% cumulé"
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY Nocom
    ORDER BY SUM(PrixUnit);
```



## Accès à la ligne précédente

`LAG()` permet d'accéder, sur une ligne, à la valeur de la ligne précédente. Cela permet de faire des sous-totaux cumulés ou des calculs de variation. 
Elle prend trois arguments :
- expression : colonne à considérer
- offset : le décalage vers les lignes précédentes
- default : valeur par défaut si aucune ligne précédente n'existe

### `LAG()` sans partitionnement

```sql
SELECT 
    STRFTIME('%Y', DateCom) "Année", 
    Nocom, 
    SUM(PrixUnit) "CA Annuel N", 
    LAG (SUM(PrixUnit),  1, 0) OVER (
        ORDER BY DateCom
    ) "CA Annuel N-1" 
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY strftime('%Y', DateCom)
    ORDER BY DateCom;
```

### `LAG()` avec clause de partitionnement

Cette variante de la requête précédente partitionne les données par année puis par client.

```sql
SELECT 
    STRFTIME('%Y', DateCom) "Année", 
    CodeCLi "Client",
    SUM(PrixUnit) "CA Annuel N", 
    LAG (SUM(PrixUnit),  1, 0) OVER ( 
        PARTITION BY STRFTIME('%Y', DateCom) 
        ORDER BY DateCom
    ) "CA Annuel N-1"
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY strftime('%Y', DateCom), CodeCLi
    ORDER BY DateCom;
```

La colonne produite peut servir dans des expressions de calcul, par exemple pour connaître la variation de la valeur entre deux groupes de données.

```sql
SELECT 
    STRFTIME('%Y', DateCom) "Année", 
    CodeCLi "Client",
    SUM(PrixUnit) "CA Annuel N", 
    LAG (SUM(PrixUnit),  1, 0) OVER ( 
        PARTITION BY CodeCLi 
        ORDER BY DateCom
    ) "CA Annuel N-1", 
    SUM(PrixUnit) - LAG (SUM(PrixUnit),  1, 0) OVER ( 
        PARTITION BY STRFTIME('%Y', DateCom) 
        ORDER BY DateCom
    )
    "Différence"
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY strftime('%Y', DateCom), CodeCLi
    ORDER BY DateCom;
```


## Accès à la ligne suivante

La fonction `LEAD()` à l'inverse de `LAG()` permet d'accéder à la valeur de la ligne suivante.

Elle prend trois arguments :
- expression : colonne à considérer
- offset : le décalage vers les lignes précédentes
- default : valeur par défaut si aucune ligne précédente n'existe

### `LEAD()` sans partitionnement

```sql
SELECT 
    STRFTIME('%Y', DateCom) "Année", 
    SUM(PrixUnit) "CA Annuel N", 
    LEAD (SUM(PrixUnit),  1, 0) OVER (
        ORDER BY DateCom
    ) "CA Annuel N+1" 
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY strftime('%Y', DateCom)
    ORDER BY DateCom;
```

### `LEAD()` avec partitionnement

Cette variante de la requête précédente partitionne les données par année puis par client.

```sql
SELECT 
    STRFTIME('%Y', DateCom) "Année", 
    CodeCLi "Client",
    SUM(PrixUnit) "CA Mensuel N", 
    LEAD (SUM(PrixUnit),  1, 0) OVER ( 
        PARTITION BY strftime('%Y', DateCom) 
        ORDER BY DateCom
    ) "CA Mensuel N+1"
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY strftime('%Y', DateCom), CodeCLi
    ORDER BY DateCom;
```


## Accès à une ligne définie

Si `LEAD()` et `LAG()` permettent d'avoir la valeur d'avant et la valeur d'après, la fonction `NTH_VALUE()` permet de sélectionner la position relative de la ligne dont on veut la valeur. 

### `NTH_VALUE()` sans partitionnement

```sql
SELECT NoCom, CodeCli,
    NTH_VALUE (CodeCli, 2) OVER ( 
        ORDER BY NoCom DESC
    )
FROM Commande;
```

### `NTH_VALUE()` avec partitionnement

```sql
SELECT NoCom, CodeCli,
    NTH_VALUE (CodeCli, 2) OVER ( 
        PARTITION BY CodeCli
        ORDER BY NoCom DESC
    )
FROM Commande;
```


## Accès à la première valeur d'une partition

La fonction `FIRST_VALUE()` permet de récupérer la première valeur d'une partition sur chaque ligne de la partition. Lorsque la partition est triée, cela permet d'avoir la valeur minimum de la partition.

```sql
SELECT 
    STRFTIME('%Y-%m', DateCom) "Année", 
    SUM(PrixUnit) "CA Annuel N", 
    FIRST_VALUE(SUM(PrixUnit)) OVER (
        PARTITION BY STRFTIME('%Y', DateCom)
        ORDER BY SUM(PrixUnit)  
        RANGE BETWEEN UNBOUNDED PRECEDING AND 
        CURRENT ROW
    ) "Decembre"
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY strftime('%Y-%m', DateCom)
    ORDER BY DateCom;
```

La clause `UNBOUNDED PRECEDING` permet de scanner toutes les lignes précédant la ligne courante dans la partition.


## Accès à la dernière valeur d'une partition

La fonction `LAST_VALUE()` est l'inverse de la fonction `FISRT_VALUE()`. Lorsque la partition est triée, cela permet d'avoir la valeur maximum de la partition.

```sql
SELECT 
    STRFTIME('%Y-%m', DateCom) "Année", 
    SUM(PrixUnit) "CA Annuel N", 
    LAST_VALUE(SUM(PrixUnit)) OVER (
        PARTITION BY STRFTIME('%Y', DateCom)
        ORDER BY SUM(PrixUnit)  
        RANGE BETWEEN CURRENT ROW AND 
        UNBOUNDED FOLLOWING
    ) "Decembre"
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY strftime('%Y-%m', DateCom)
    ORDER BY DateCom;
```

La clause `UNBOUNDED FOLLOWING` permet de scanner toutes les lignes suivant la ligne courante dans la partition.


## Classification des valeurs de la partition

La fonction `NTILE()` permet de classer les valeurs en groupes similaires. L'argument de la fonction définit le nombre de groupes que l'on veut créer. 

La requête ci-dessous liste les produits par catégorie et les classe en trois groupes de prix croissants.

```sql
SELECT CodeCateg, PrixUnit, 
    NTILE (3) OVER ( 
        PARTITION BY CodeCateg
        ORDER BY PrixUnit
    ) "Bucket" 
    FROM Produit 
    ORDER BY CodeCateg;
```


## Distribution cumulée

Cette fonction calcule le pourcentage de distribution cumulé des valeurs de la partition. Voici un calcul pour illustrer ce pourcentage :
```
Nombre de lignes avec valeur <= N / Nombre de lignes totales de la partition
```

Comme pour `PERCENT_RANK()`, la valeur étant décimale, il convient de la multiplier par 100 pour avoir la valeur en pourcentage.

### `CUME_DIST()` sans partitionnement 

Distribution cumulée de chaque catégorie.

```sql
SELECT DISTINCT 
    CodeCateg, 
    CUME_DIST() 
    OVER (
        ORDER BY CodeCateg
    ) * 100 CumulativeDistribution
FROM Produit;
```

### `CUME_DIST()` avec partitionnement 

Distribution cumulée du fournisseur dans chaque catégorie.

```sql
SELECT DISTINCT 
    NoFour,
    CodeCateg, 
    CUME_DIST() 
    OVER (
        PARTITION BY CodeCateg 
        ORDER BY NoFour
    ) * 100 CumulativeDistribution
FROM Produit;
```


## Exercices

1. Listez les clients en les numérotant en fonction de leur chiffre d'affaire global   
2. Listez pour chaque mois de l'année le nom des produits vendus en affichant leur chiffre d'affaires cummulé sur le mois set leur rang dans la liste
3. Listez les clients en affichant leur chiffre d'affaires cumulé
4. Listez pour chaque année et chaque client, le CA qu'il a réalisé pour l'année considérée en affichant également le CA de l'année précédente
