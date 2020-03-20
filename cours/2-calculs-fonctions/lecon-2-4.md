# Fonctions sur les dates

Nous disposons en `SQL` (comme dans d'autres langages) de plusieurs formats pour les dates. Soit nous avons uniquement la date (jour, mois et année - stockée sous la forme d'un entier représentant le nombre de jours depuis une date de référence, souvent le 1/1/1970). Il existe aussi un format où la date, l'heure et le fuseau horaire sont stockées (précisemment, le nombre de secondes depuis la même date de référence et le fuseau horaire). 

Nous allons voir ici quelques fonctions utiles pour les dates : `DATE()` pour générer des dates, `STRFTIME()` pour obtenir des informations à partir d'une date.

Vous trouverez sur [cette page](https://sqlite.org/lang_datefunc.html) plus d'informations sur les fonctions disponibles.


## Formats 

Pour être interprétées par SQLite, les dates et heures peuvent être formatées de la façon suivantes :
- YYYY-MM-DD
- YYYY-MM-DD HH:MM
- YYYY-MM-DD HH:MM:SS
- YYYY-MM-DD HH:MM:SS.SSS
- YYYY-MM-DDTHH:MM
- YYYY-MM-DDTHH:MM:SS
- YYYY-MM-DDTHH:MM:SS.SSS
- HH:MM
- HH:MM:SS
- HH:MM:SS.SSS
- now
- DDDDDDDDDD


## Génération de dates

En premier lieu, si nous désirons avoir la date du jour (de l'exécution de la requête bien sûr), nous pouvons exécuter cette requête. Par défaut, la date est affichée au format `"YYYY-MM-DD"`.

```sql
SELECT DATE("now");
```

La commande `DATE()` peut prendre d'autres paramètres après le premier contenant la date (ou `"now"`), permettant de modifier cette date :

Modifier | Fonction 
-------|---------
+/- NNN days | Ajoute ou retire des jours
+/- NNN months | Ajoute ou retire des mois
+/- NNN years | Ajoute ou retire des années
start of month | Début du mois spécifié 
start of year | Début de l'année spécifiée 
start of day | Début du jour spécifié
weekday N | Avance ou recule au jour 
unixepoch | Date au format Unix DDDDDDDDDD 
localtime | Ajuste une date UTF au fuseau horaire
utc | Ajuste une date locale sur UTC


Pour `weedday`, les jours sont numérotés à partir de 0 : 0=Dimanche, 1=Lundi, 2=Mardi, ...

La requête suivante permet d'avoir la date de la veille.

```sql
SELECT DATE("now", "-1 day");
```

Il est possible de cumuler plusieurs modificateurs pour, par exemple, obtenir le dernier jour du mois dernier.

```sql
SELECT DATE("now", "start of month", "-1 day");
```

Ou d'obtenir la date du mois prochain moins un jour

```sql
SELECT date('now','start of month','+1 month','-1 day');
```

La commande `DATE()` accepte aussi en premier paramètre une date au bon format, pour par exemple lui appliquer une modification par la suite. Nous avons ici la date du lendemain de la commande.

```sql
SELECT DATE(DateCom, "+1 day") 
    FROM Commande;
```


## Génération d'heures

La fonction `TIME()` permet de récupérer l'heure courante du serveur. Le format par défaut est `HH:MM:SS`.

```sql
SELECT TIME();
```

```sql
SELECT TIME("14:10:00");
```

La commande `TIME()` peut prendre d'autres paramètres après le premier contenant l'heure, permettant de modifier cette heure. 

La modification de l'heure se fait avec les modifieurs suivants :

Modifier | Fonction 
-------|---------
+/- NNN hours | Ajoute ou retire des heures
+/- NNN minutes | Ajoute ou retire des minutes
+/- NNN.NNNN seconds | Ajoute ou retire des secondes

```sql
SELECT TIME("14:10:00","+3 hours");
```

```sql
SELECT
    time('10:20:30','+1 hours','+20 minutes')
```


## Dates et heures 

La fonction `DATETIME()` permet de combiner la date et l'heure dans une seule valeur. 

```sql
SELECT datetime("now") as "Date et heure courante";
```

Pour ajuster la valeur, il est possible d'utiliser tous les modifieurs que nous avons vu précédemment : 

```sql
SELECT datetime("now", "start of month", "+564 minutes") as "Date et heure";
```

```sql
SELECT datetime("now", "start of month", "+1 day", "+1 hour", "+20 minutes") 
	AS "Date et heure";
```


## Informations à partir d'une date

La commande `STRFTIME()` permet elle d'obtenir des informations à partir d'une date. On indique l'information désirée par un caractère précédé d'un `"%"`

Masque | Fonction 
-------|---------
%d | Jour du mois : 00
%f | Fractions de secondes : SS.SSS
%H | Heure : 00-24
%j | Jour de l'année : 001-366
%J | Numéro de jour julien
%m | Mois: 01-12
%M | Minute: 00-59
%s | Secondes since 1970-01-01s
%S | Secondes: 00-59
%w | Day of week 0-6 with Sunday==0
%W | Week of year: 00-53
%Y | Year: 0000-9999
%% | %

 Dans l'exemple ci-après, on récupère l'année (`"%Y"`), le mois (`"%m"`) et le jour ("`%d"`) de la date actuelle. Il est aussi possible de les combiner pour écrire la date dans un format plus classique pour nous.

```sql
SELECT DATE("now") AS "Aujourd'hui",
		STRFTIME("%Y", "now") AS "Année",
		STRFTIME("%m", "now") AS "Mois",
		STRFTIME("%d", "now") AS "Jour",
		STRFTIME("%d/%m/%Y", "now") AS "Nouveau format";
```

Il existe d'autres informations potentiellement intéressantes sur les dates, comme le jour de la semaine (`"%w"`), le jour dans l'année (`"%j"`) ou la semaine dans l'année (`"%W"`).

```sql
SELECT DATE("now") AS "Aujourd'hui",
		STRFTIME("%w", "now") as "Jour de la semaine",
		STRFTIME("%j", "now") as "Jour de l'année",
		STRFTIME("%W", "now") as "Semaine dans l'année";
```

Il faut noter que le jour de la semaine a une valeur entre 0 (pour le dimanche) et 6 (pour le samedi). Par contre, le jour de l'année a une valeur entre 1 et 366. Le numéro de semaine dans l'année commence lui aussi à 0 jusqu'à 52 (voire 53).

Nous disposons de deux autres informations très utiles pour les différences de dates :

- le nombre de secondes depuis le 1/1/1970 avec `"%s"`
- le jour julien (cf [page Wikipedia](https://fr.wikipedia.org/wiki/Jour_julien)) avec 
	- soit `"%J"` dans la fonction `STRFTIME()`
	- soit la fontion `%JULIANDAY()`

```sql
SELECT DATE("now"),
		STRFTIME("%s", "now") as "Nb secondes depuis 1/1/1970",
		STRFTIME("%J", "now") as "Jour julien",
		JULIANDAY("now") as "Jour julien";
```

Ainsi, il est possible de calculer le nombre de jours entre deux dates de 2 manières. Pour rappel, une journée dure 24 heures de 60 minutes, chacune faisant 60 secondes, ce qui fait qu'une journée dure 86400 secondes (24 $\times$ 60 $\times$ 60).

Dans l'exemple ci-dessous, nous calculons le nombre de jours qu'ont duré les Jeux Olympiques 2016 (du 5 au 21 août).

```sql
SELECT JULIANDAY("2016-08-21") - JULIANDAY("2016-08-05");
```

On calcule la même différence en utilisant la fonction `STRFTIME()` et le nombre de secondes depuis le 1/1/1970.

```sql
SELECT (STRFTIME("%s", "2016-08-21") - STRFTIME("%s", "2016-08-05")) / 86400;
```


## Exercices

1. Afficher le jour de la semaine en lettre pour toutes les dates de commande
1. Compléter en affichant `"week-end"` pour les samedi et dimanche, et `"semaine"` pour les autres jour
1. Calculer le nombre de jours entre la date de la commande (`DateCom`) et la date butoir de livraison (`ALivAvant`), pour chaque commande
1. On souhaite aussi contacter les clients 1 an, 1 mois et 1 semaine après leur commande. Calculer les dates correspondantes pour chaque commande
