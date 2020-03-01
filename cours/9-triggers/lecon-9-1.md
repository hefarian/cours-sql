# Triggers

Un trigger est un élément de la base de données qui est exécuté automatiquement lorsqu'une instruction `INSERT`,`UPDATE` ou `DELETE` a lieu sur une table. 

Ils permettent, par exemple : 
- de rajouter des contrôles avant l'exécution d'une transaction
- de faire de l'audit des changements apportés à la base de données
- d'implémenter des règles métier

Attention : ajouter de la logique dans la base de données est délicat, les développeurs ont tendance à oublier qu'elle est là.


## Syntaxe

La création d'une vue revient à créer une requête SQL stockée en base avec un nom :

```sql
CREATE TRIGGER [IF NOT EXISTS] trigger_name 
   [BEFORE|AFTER|INSTEAD OF] [INSERT|UPDATE|DELETE] 
   ON table_name
   [WHEN condition]
BEGIN
 statements;
END;
```
Les mots clé `BEFORE`, `AFTER` et `INSTEAD OF` permettent de spécifier si le trigger se déclenche avant, après ou à la place l'instruction.

Le mot clé `WHEN` permet de définir des conditions de déclenchement : le trigger n'agit que si la condition est vraie.

Pour le moment, SQLite ne supporte que les triggers de type `FOR EACH ROW`, les triggers se déclenchent une fois pour chaque ligne touchée par l'instruction de déclenchement. 

Si on combine les possibilités de déclenchement, cela nous donne : 
- `BEFORE INSERT`
- `AFTER INSERT`
- `BEFORE UPDATE`
- `AFTER c`
- `BEFORE DELETE`
- `AFTER DELETE`
- `INSTEAD OF INSERT`
- `INSTEAD OF DELETE`
- `INSTEAD OF UPDATE`



## Accès aux données de la transaction 

Nous avons accès aux données qui sont insérées, mises à jour ou supprimées à l'aide des mots clé `OLD` et `NEW` sous la forme : `OLD.nom_colonne` et `NEW.nom_colonne`. 

Toutes les clauses ne sont pas disponibles, cela dépend de l'instruction : 
- `INSERT` : NEW est disponible
- `UPDATE` : OLD et NEW sont disponibles
- `DELETE` : OLD est disponible


## Création d'un trigger

Supposons que l'on souhaite valider le format de l'adresse email d'un client avant son insertion en base de données. 

Ajout de l'email dans la table client : 

```sql
ALTER TABLE Client ADD Email VARCHAR(150);
```

Le trigger permettant cette vérification est le suivant : 

```sql
CREATE TRIGGER TRG_ValidateEmailClient
   BEFORE INSERT ON Client
BEGIN
   SELECT
      CASE
    WHEN NEW.Email NOT LIKE '%_@__%.__%' THEN
        RAISE (ABORT,'Email invalide')
    END;
END;
```

Test du trigger : 

```sql
INSERT INTO Client (CodeCli, Societe, Email)
VALUES('CYBER', 'Cyberdyne', 'emailinvalide.com');
```

```sql
INSERT INTO Client (CodeCli, Societe, Email)
VALUES('CYBER', 'Cyberdyne', 'email@valide.com');
```

```sql
SELECT CodeCli, Societe, Email 
FROM Client 
WHERE CodeCli = 'CYBER';
```

## Suppression d'un trigger

La clause `IF EXISTS ` est optionelle, un message d'erreur alors affiché si on essaye de supprimer un trigger n'existant pas.

```sql
DROP TRIGGER IF EXISTS TRG_ValidateEmailClient;
```

Si une table est supprimée, les triggers dessus sont supprimés également. 

## Exercices

1. Créer un trigger qui vérifie que le numéro de téléphone d'un client commence par un +
2. Créer un trigger qui vérifie que le pays de livraison prévu correspond bien à un pays qui existe dans la table des clients