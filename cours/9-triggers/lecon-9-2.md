# Triggers `INSTEAD OF`

Les triggers `INSTEAD OF` fonctionnent uniquement sur des vues, il n'est pas possible de les utiliser avec des tables.

Les vues étant en lecture seule, il est impossible d'exécuter dessus des instructions de DML telles que `INSERT`, `UPDATE` ou `DELETE`.

Lorsqu'une vue possède un trigger `INSTEAD OF`, il va réagir à l'instruction de DML et nous permettre d'exécuter de la logique. Par exemple, il va être possible de remplacer un `INSERT` sur la vue par un `INSERT` et un `UPDATE` sur deux tables sous-jascentes.

Cela permet de contourner la restriction des vues et permettre des modifications sur les données qui s'y trouvent.


## Syntaxe

La création d'une vue revient à créer une requête SQL stockée en base avec un nom :

```sql
CREATE TRIGGER [IF NOT EXISTS] schema_ame.trigger_name
    INSTEAD OF [DELETE | INSERT | UPDATE OF column_name]
    ON table_name
BEGIN
   statements;
END;
```

## Création d'un trigger `INSTEAD OF`

Exemple : nous souhaitons permettre l'insertion d'un produit et d'une catégorie directement avec une insertion dans la vue. 

### Création de la vue

La vue sur laquelle le trigger va être placé est la suivante :

```sql
CREATE VIEW IF NOT EXISTS V_ProduitsCategories (Code, Libelle, Categorie) AS
SELECT RefProd, NomProd, NomCateg
	FROM Produit INNER JOIN Categorie
		ON Produit.CodeCateg = Categorie.CodeCateg;
```

Test de la vue : 

```sql
SELECT * FROM V_ProduitsCategories;
```

### Création du trigger

Le trigger permettant l'insertion est le suivant : 

```sql
CREATE TRIGGER TRG_InsertProduitCategorie
    INSTEAD OF INSERT ON V_ProduitsCategories
BEGIN
    INSERT INTO Categorie(CodeCateg, NomCateg)
    VALUES(SUBSTR(UPPER(NEW.Categorie),0,5), NEW.Categorie);
    
    INSERT INTO Produit(RefProd, NomProd, CodeCateg)
    VALUES(New.Code, NEW.Libelle, SUBSTR(UPPER(NEW.Categorie),0,5));
END;
```

Dans ce trigger, nous pourrions utiliser la fonction `last_insert_rowid()` qui permettrait de récupérer le rowid de la ligne ajoutée dans la table `Categorie` pour l'ajouter dans la colonne `CodeCateg` de la table des `Produits`. Ici ce n'est pas nécessaire car le code n'est pas un ID de clé auto-incrémenté.

### Test du trigger

Insertion d'un produit dans la vue :

```sql
INSERT INTO V_ProduitsCategories (Code, Libelle, Categorie)
VALUES(9999, 'Charentaises', 'Pantouffles');
```

Vérification de l'insertion dans la vue :

```sql
SELECT * FROM V_ProduitsCategories WHERE Code=9999;
```

La catégorie a bien été ajoutée :
```sql
SELECT * FROM Categorie WHERE CodeCateg='PANT';
```

Le produit également :
```sql
SELECT * FROM Produit WHERE RefProd=9999;
```

## Exercices

1. Créer une vue affichant le libellé de chaque produit avec le nom de son fournisseur. Ajoutez un trigger permettant d'ajouter un produit dans la vue : il doit créer le fournisseur, le produit et permettre la jointure entre les deux.
2. Créer une vue affichant chaque catégorie avec le nombre de produits qu'elle contient. Ajoutez un trigger permettant d'ajouter une nouvelle catégorie dans cette vue