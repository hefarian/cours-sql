# Triggers `INSERT`, `UPDATE` ou `DELETE`

Un trigger est un élément de la base de données qui est exécuté automatiquement lorsqu'une instruction `INSERT`, `UPDATE` ou `DELETE` a lieu sur une table. 

Ils permettent, par exemple : 
- de rajouter des contrôles avant l'exécution d'une transaction
- de faire de l'audit des changements apportés à la base de données
- d'implémenter des règles métier

Attention : ajouter de la logique dans la base de données est délicat, les développeurs ont tendance à oublier qu'elle est là.


## Syntaxe

La création d'une vue revient à créer une requête SQL stockée en base avec un nom :

```sql
CREATE TRIGGER [IF NOT EXISTS] trigger_name 
   [BEFORE|AFTER] [INSERT|UPDATE|DELETE] 
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
- `AFTER UPDATE`
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


## Création d'un trigger `BEFORE INSERT`

Exemple : nous souhaitons valider le format de l'adresse email d'un client avant son insertion en base de données : si l'adresse n'est pas au bon format, l'insertion est bloquée.

### Mise à jour de la table `Client`

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

### Test du trigger

Insertion d'un client avec un mail invalide :

```sql
INSERT INTO Client (CodeCli, Societe, Email)
VALUES('CYBER', 'Cyberdyne', 'emailinvalide.com');
```

Insertion d'un client avec un mail valide :

```sql
INSERT INTO Client (CodeCli, Societe, Email)
VALUES('CYBER', 'Cyberdyne', 'email@valide.com');
```

Vérification du contenu de la table :

```sql
SELECT CodeCli, Societe, Email 
FROM Client 
WHERE CodeCli = 'CYBER';
```

## Création d'un trigger `AFTER UPDATE`

Exemple : nous souhaitons conserver l'historique des emails utilisés par le client dans une table dédiée à leur historisation. 

### Création de la table d'historique

```sql
CREATE TABLE HistoriqueMail (
    Id INTEGER PRIMARY KEY,
    CodeClient VARCHAR(30),
    AncienEmail TEXT,
    NouvelEmail TEXT,
    Operation TEXT,
    Moment TEXT
);
```

### Création du trigger

Le trigger permettant cette historisation est le suivant : 

```sql
CREATE TRIGGER TRG_HistoriqueEmailClient
   AFTER UPDATE ON Client
   WHEN OLD.Email <> NEW.Email
BEGIN
   INSERT INTO HistoriqueMail (
      CodeClient,
      AncienEmail,
      NouvelEmail,
      Operation,
      Moment
   )
   VALUES
   (
      OLD.CodeCli,
      OLD.Email,
      NEW.Email,
      'UPDATE',
      DATETIME('NOW')
   );
END;
```

### Test du trigger 

Un update de la société ne déclenche pas le trigger : 

```sql
UPDATE Client 
SET Societe = 'Cyberdyne Systems'
WHERE CodeCli = 'CYBER';
```

Vérification : 

```sql
SELECT * FROM HistoriqueMail;
```

Un update de l'email déclenche le trigger : 

```sql
UPDATE Client 
SET Email = 'email@cyberdyne.com'
WHERE CodeCli = 'CYBER';
```

Vérification : 

```sql
SELECT * FROM HistoriqueMail;
```

## Suppression d'un trigger

La clause `IF EXISTS ` est optionelle, un message d'erreur alors affiché si on essaye de supprimer un trigger n'existant pas.

```sql
DROP TRIGGER IF EXISTS TRG_ValidateEmailClient;
```

Si une table est supprimée, les triggers dessus sont supprimés également. 

## Exercices

1. Créer un trigger qui vérifie avant insertion ou mise à jour que le numéro de téléphone d'un client commence bien par un caractère `+`. Si ce n'est pas le cas, l'insertion ne doit pas avoir lieu
1. Créer un trigger qui vérifie avant insertion ou mise à jour que le pays de livraison prévu correspond bien à un pays qui existe dans la table des clients. Si ce n'est pas le cas, l'insertion ne doit pas avoir lieu
1. Créer un trigger qui audite les changements apportés à la colonne RendCompteA de la table des employés. Créer au préalable une date d'audit avec les colonnes nécessaires puis un trigger qui va enregistrer dedans la date du changement, le nom de l'ancien manager et le nom du nouveau manager