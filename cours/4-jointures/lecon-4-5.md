# Auto-jointures 

Certains modèles de données sont organisés pour permettre l'exécution de requêtes SQL **hiérarchiques**. 

## Principe

Lorsque la table possède une clé étrangère vers elle même, elle s'appelle une clé d'**auto-référencement**. Ces clés permettent de faire des **auto-jointures** pour exécuter des requêtes **récursives**.

### Syntaxe

Comme il n'est pas possible de joindre deux fois la table sur elle même car le serveur ne comprends pas ce que l'on souhaite sélectionner. Cette requête renvoie une erreur : `ambiguous column name: Nom`

```sql
SELECT Nom, Prenom, Nom, Prenom 
from Employe, Employe
where RendCompteA = NoEmp;
```

### Exemple d'autojointure

La syntaxe impose d'utiliser les alias de tables pour faire ce genre de requête : 

```sql
SELECT e.Nom, e.Prenom, m.Nom, m.Prenom 
from Employe e, Employe m
where e.RendCompteA = m.NoEmp;
```

Avec la nouvelle syntaxe : 

```sql
SELECT e.Nom, e.Prenom, m.Nom, m.Prenom 
FROM Employe e INNER JOIN Employe m
ON (e.RendCompteA = m.NoEmp);
```

En mode externe pour récupérer le patron qui n'a pas de responsable, sa colonne `"RendCompteA"` est nulle :

```sql
SELECT e.Nom, e.Prenom, m.Nom, m.Prenom 
FROM Employe e LEFT OUTER JOIN Employe m
ON (e.RendCompteA = m.NoEmp);
```
