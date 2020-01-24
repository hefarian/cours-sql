# Fonctions de fenêtrage

Ces fonctions vont effectuer des calcules basés sur des lignes liées à une ligne particulière. Contrairement aux fonctions de regroupement, elles n'aggrègent pas les données.

Ces fonctions nécessitent d'utiliser une fenêtre avec la clause `PARTITION BY`. Cette clause, dite de **partitionnement** ou de **fenêtrage**, divise les lignes en sous-ensembles auxquels la fonction va s'appliquer.

## Clause de partitionnement

La clause de partitionnement permet de grouper les données selon un critère puis d'appliquer la fonction sur la fenêtre ainsi créée. La requête suivante partitionne les données par date et numérote les lignes individuellement dans chaque groupe.
Sans cette clause de partitionnement, toutes les lignes du résultat sont considérées comme une seule partition.

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

1. 