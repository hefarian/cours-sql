# Exercices complémentaires

### Exercice 1 
Créer une vue permettant de synthétiser les commandes en affichant : la date de commande, le numéro de commande, le nom du client, le montant total de la remise, le montant total de la commande, le nombre de produits à dans la commande

### Exercice 2 
Créer une vue pour afficher la popularité des produits commandés : Nom du produit, quantité commandée, date de dernière commande, le tout trié par nombre de commande croissant

### Exercice 3 
Sur la base des deux requêtes ci-dessous, définissez une vue qui permet de mutualiser les informations communes entre les deux. Réécrivez ensuite ces deux requêtes pour qu'elles soient basées sur la vue et donc plus simples. Pensez à bien analyser les requêtes au départ pour bien inclure dans la vue toutes les informations dont vous aurez besoin.

```sql
SELECT cl.Societe, ca.NomCateg, SUM(dc.Qte)
FROM Client cl 
INNER JOIN Commande c ON cl.CodeCli = c.CodeCli
INNER JOIN DetailCommande dc ON c.NoCom=dc.NoCom
INNER JOIN Produit p ON p.RefProd=dc.RefProd
INNER JOIN Categorie ca ON p.CodeCateg=ca.CodeCateg
GROUP BY cl.Societe, ca.NomCateg
ORDER BY 1,2 ASC;
```

```sql
SELECT f.Societe, ca.NomCateg AS Categorie, SUM(dc.Qte) AS QTE , SUM(dc.Qte*dc.PrixUnit) AS CA
FROM Fournisseur f 
INNER JOIN Produit p ON p.NoFour=f.Nofour
INNER JOIN DetailCommande dc ON p.RefProd=dc.RefProd
INNER JOIN Categorie ca ON p.CodeCateg=ca.CodeCateg
GROUP BY f.Societe, ca.NomCateg
ORDER BY 4 DESC;
```

