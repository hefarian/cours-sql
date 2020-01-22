# Fonctions de fenêtrage

Ces fonctions vont effectuer des calcules basés sur des lignes liées à une ligne particulière. Contrairement aux fonctions de regroupement, elles n'aggrègent pas les données.

Ces fonctions nécessitent d'utiliser une fenêtre avec la clause `PARTITION BY`. Cette clause divise les lignes en sous-ensembles auxquels la fonction va s'appliquer.

La requête ci-dessous ramène les commandes avec leur montant total, trié par date, utilisons la comme base pour tester ces fonctions.


## Fonction `RANK()`

Cette fonction calcule le rang de chaque ligne parmi l'ensemble des lignes retournées.

### Exemple simple

```sql
SELECT
    Nocom, RANK () OVER (ORDER BY Nocom)
    FROM Commande;
```

### Exemple avec jointure

Cette requête liste les commandes triées par montant croissant et affiche le rang correspondant.

```sql
SELECT DateCom, Nocom, SUM(PrixUnit) "Montant total", 
    RANK () OVER (ORDER BY SUM(PrixUnit))
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY Nocom
    ORDER BY SUM(PrixUnit);
```

## Clause de partitionnement

La clause de partitionnement permet de grouper les données selon un critère puis d'appliquer la fonction sur la fenêtre ainsi créée. La requête suivante partitionne les données par date et numérote les lignes individuellement dans chaque groupe.
Sans cette clause de partitionnement, toutes les lignes sont considérées comme une seule partition.

```sql
SELECT DateCom, Nocom, SUM(PrixUnit) "Montant total", 
    RANK () OVER (PARTITION BY DateCom ORDER BY SUM(PrixUnit))
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY Nocom
    ORDER BY DateCom;
```


## Fonction `LAG()`

`LAG()` permet d'accéder, sur une ligne, à la valeur de la ligne précédente. Cela permet de faire des sous-totaux cumulés ou des calculs de variation. 
Elle prend trois arguments :
- expression : colonne à considérer
- offset : le décalage vers les lignes précédentes
- default : valeur par défaut si aucune ligne précédente n'existe

### Exemple simple

```sql
SELECT 
    STRFTIME('%Y', DateCom) "Année", 
    Nocom, 
    SUM(PrixUnit) "CA Annuel N", 
    LAG (SUM(PrixUnit),  1, 0) OVER ( ORDER BY DateCom) "CA Annuel N-1" 
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY strftime('%Y', DateCom)
    ORDER BY DateCom;
```

### Exemple avec clause de partitionnement

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


## Fonction `LEAD()`

La fonction `LEAD()` à l'inverse de `LAG()` permet d'accéder à la valeur de la ligne suivante.

Elle prend trois arguments :
- expression : colonne à considérer
- offset : le décalage vers les lignes précédentes
- default : valeur par défaut si aucune ligne précédente n'existe

### Exemple simple

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

### Exemple avec clause de partitionnement

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


## Fonction `LAST_VALUE()`

La fonction `LAST_VALUE()` permet de récupérer la dernière valeur d'une partition sur chaque ligne de la partition. Lorsque la partition est triée, cela permet d'avoir la valeur minimum ou maximum de la partition.

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

