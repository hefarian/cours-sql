# Fonctions de fenêtrage

Ces fonctions vont effectuer des calcules basés sur des lignes liées à une ligne particulière. Contrairement aux fonctions de regroupement, elles n'aggrègent pas les données.

Ces fonctions nécessitent d'utiliser une fenêtre avec la clause `PARTITION BY`. Cette clause divise les lignes en sous-ensembles auxquels la fonction va s'appliquer.

La requête ci-dessous ramène les commandes avec leur montant total, trié par date, utilisons la comme base pour tester ces fonctions.

```sql
SELECT
    DateCom, Nocom, SUM(PrixUnit) "Montant total"
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY Nocom
    ORDER BY 1;
```

## Calcul simple

```sql
SELECT
    DateCom, Nocom, SUM(PrixUnit) "Montant total"
    FROM Commande NATURAL JOIN DetailCommande
    GROUP BY Nocom
    ORDER BY 1;
```