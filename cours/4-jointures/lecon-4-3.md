# Jointures externes

## Principe

Comme indiqué précédemment, si une ligne d'une table n'a pas de correspondance dans l'autre table, celle-ci ne sera pas conservé dans le résultat. 

Ainsi, les clients sans commande associée ne seront pas dans la table résultante de la jointure naturelle ou interne entre `Client` et `Commande`. 

Pour cela, nous devons utiliser une **jointure externe** (`OUTER JOIN`) . Celle-ci a pour but de garder toutes les lignes des deux tables (ou d'une seule des deux).

Une jointure se fait entre deux tables. Nous parlerons de **jointure externe gauche** (`LEFT OUTER JOIN`) quand nous garderons les lignes de la table à gauche (la première citée donc). Et nous parlerons de **jointure externe droite** (`RIGHT OUTER JOIN`) quand nous garderons les lignes de la table à droite (la deuxième donc). Enfin, si l'on souhaite garder toutes les lignes des deux tables, il faut faire une **jointure externe complète** (`FULL OUTER JOIN`).

**ATTENTION** Dans l'outil utilisé ici, seule la jointure externe gauche est implémenter. Pour obtenir la jointure externe droite, il suffit d'inverser les tables. Pour la jointure complète, nous devrons utiliser en plus un opérateur que nous verrons plus tard.

Dans notre cas, si nous souhaitons avec les clients avec les détails de commande, tout en gardant la table de résultat les clients sans commande, nous devons donc réaliser une jointure externe gauche entre `Client` (à gauche) et `Commande` (à droite).

```sql
SELECT cl.CodeCli, co.NoCom
FROM Client Cl 
LEFT JOIN Commande Co ON Cl.CodeCli = Co.CodeCli
Order by Nocom DESC;
```

Si vous regardez les lignes pour les clients `"ESPAC"` et `"ETOUR"` (entre autres), vous verrez qu'il n'y a aucune information sur les attributs de la table `Commande` (à partir de `NoCom`).

De plus, nous voyons qu'il y a 835 lignes dans la table résultat, correspondant aux 830 commandes plus les 5 clients n'ayant pas de commande associée.

## Décompte avec prise en compte du 0

L'intérêt de ce type de jointure réside principalement dans du dénombrement, en gardant l'information comme quoi certaines modalités de dénombrement n'ont aucune ligne associée.

Le problème est que si on réalise un décompte classique (avec `COUNT(*)` donc), ces lignes ne sont pas gardées finalement. 

Par exemple, si nous souhaitons connaître le nombre de commandes par client, il serait usuel de faire la requête suivante. On remarque qu'il y a bien tous les clients (dont `ESPAC` et `ETOUR`) mais tous avec au minimum un décompte à 1. C'est normal car `COUNT(*)` compte le nombre de lignes. Et il y a bien au moins une ligne par client.


```sql
SELECT Cl.CodeCli, COUNT(*)
FROM Client Cl LEFT OUTER JOIN Commande Co
	ON Cl.CodeCli = Co.CodeCli
GROUP BY Cl.CodeCli
ORDER BY 2;
```

Si l'on veut avoir le nombre de commandes, et donc 0 pour ceux n'ayant aucune commande, il faut compter le nombre de valeurs non nulles d'un attribut, et de préférence la clé primaire de la deuxième table.

Ainsi, si nous comptons le nombre de valeurs non nulles de `NoCom` (avec `COUNT(NoCom)`), comme fait dans la requête qui suit, nous avons bien un `0` qui apparaît pour les clients n'ayant aucune commande associée.

```sql
SELECT Cl.CodeCli, COUNT(NoCom)
FROM Client Cl LEFT OUTER JOIN Commande Co
	ON Cl.CodeCli = Co.CodeCli
GROUP BY Cl.CodeCli
ORDER BY 2;
```

Ainsi, ce processus, combiné avec une condition sur l'agrégat (avec `HAVING`), nous permet de pouvoir récupérer uniquement les lignes d'une table n'ayant pas de correspondance dans l'autre.

Par exemple, si nous souhaitons connaître le nom des sociétés clientes pour lesquelles nous n'avons pas de commandes associées, nous pourrions faire la requête suivante. Ici, `Cl.*` permet de récupérer toutes les informations de la table `Client`.

```sql
SELECT Cl.*
FROM Client Cl LEFT OUTER JOIN Commande Co
	ON Cl.CodeCli = Co.CodeCli
GROUP BY Cl.CodeCli
HAVING COUNT(NoCom) == 0;
```

Maintenant, si on ajoute un autre calcul d'agrégat (somme, moyenne, ...), le résultat sera `NULL` pour les lignes n'ayant pas de correspondances.

Par exemple, si nous calculons les frais de port moyens pour chaque client, nous n'avons pas de résultat pour les clients n'ayant aucune commande.

```sql
SELECT Cl.CodeCli, COUNT(NoCom), AVG(Port)
FROM Client Cl LEFT OUTER JOIN Commande Co
	ON Cl.CodeCli = Co.CodeCli
GROUP BY Cl.CodeCli
ORDER BY 2;
```


## Jointures externes complètes

Les jointures externes peuvent être ouvertes "des deux côtés", en mettant en correspondance toutes les lignes qui vont ensemble et en ajoutant les autres lignes des autres tables.

Par exemple, nous pouvons lister les produits commandés avec leur client correspondants, en incluant les clients n'ayant rien commandé et les produits jamais commandés.

Voici un exemple non fonctionnel car non supporté par SQLite dans cet environnement :
```sql
SELECT ... 
FROM Client Cl FULL OUTER JOIN Commande Co
```


## Exercices

1. Compter pour chaque produit, le nombre de commandes où il apparaît, même pour ceux dans aucune commande
1. Lister les produits n'apparaissant dans aucune commande
1. Existe-t'il un employé n'ayant enregistré aucune commande ?