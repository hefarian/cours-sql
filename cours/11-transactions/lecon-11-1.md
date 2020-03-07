# Transactions

Les serveurs de base de données relationelles gèrent des transactions qui sont : atomiques, consistantes, isolées, et durables (ACID).

- **A**tomiques : 
- **C**onsistantes :  
- **I**solées : 
- **D**urables : 

Certais SGBD comme SQLite fonctionnent en `AUTOCOMMIT`, cela signifie que chaque commande `INSERT`, `UPDATE` ou `DELETE` est validée immédiatement après exécution. 


## Démarrer une transaction

Pour démarrer une transaction explicitement, il faut utiliser la commande : 

```sql
BEGIN TRANSACTION;
```

Une fois ouverte, la transaction reste active jusqu'a ce qu'elle soit explicitement finalisée par une validation ou une annulation. 

## Valider une transaction 

L'instruction de validation rend tous les changements permanents et visibles par tous les utilisateurs du serveur :

```sql
COMMIT;
```


## Annuler une transaction 

L'instruction d'annulation retire tous les changements effectués et remet les tables dans leur état d'origine.

```sql
ROLLBACK;
```


## Exemple de transaction annulée

Démarrage de la transaction :
```sql
BEGIN TRANSACTION;
```

Insertion d'une donnée :
```sql
INSERT INTO Produit ('RefProd', 'NomProd', 'NoFour', 'CodeCateg', 'QteParUnit', 'PrixUnit', 'UnitesStock', 'UnitesCom', 'NiveauReap', 'Indisponible') 
VALUES ('PROD1','Produit A1', 1, 1, 1, 18, 0, 0, 1, 1); 
```

Vérification de l'insertion :
```sql
SELECT * FROM Produit WHERE RefProd='PROD1';
```

Annulation : 
```sql
ROLLBACK;
```

Vérification de l'annulation :
```sql
SELECT * FROM Produit WHERE RefProd='PROD1';
```


## Exemple de transaction validée

Démarrage de la transaction :
```sql
BEGIN TRANSACTION;
```

Insertion d'une donnée :
```sql
INSERT INTO Produit ('RefProd', 'NomProd', 'NoFour', 'CodeCateg', 'QteParUnit', 'PrixUnit', 'UnitesStock', 'UnitesCom', 'NiveauReap', 'Indisponible') 
VALUES ('PROD1','Produit A1', 1, 1, 1, 18, 0, 0, 1, 1); 
```

Vérification de l'insertion :
```sql
SELECT * FROM Produit WHERE RefProd='PROD1';
```

Annulation : 
```sql
COMMIT;
```

Conformation de l'insertion :
```sql
SELECT * FROM Produit WHERE RefProd='PROD1';
```