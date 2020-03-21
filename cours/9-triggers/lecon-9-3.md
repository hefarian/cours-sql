# Exercices complémentaires

1. Créer une vue affichant pour chaque messager, le nombre de commandes qu'il a traité. Si le messager n'a traité aucune commande, afficher le nombre `0`. Ajoutez un trigger permettant d'insérer un nouveau messager dans cette vue.
1. Créer un trigger qui vérifie que les frais de port insérés dans la colonne `Port` de la table `Client` sont bien avec une valeur supérieure à `0`
1. Créer un trigger qui bloque les insertions de commandes contenant un produit `RefProd` ayant le champ `Indisponible` à la valeur `1`
1. Creér une table et un trigger permettant d'auter les changements d'adresse des Clients. On veut conserver les anciennes et nouvelles valeurs des champs `Adresse`, `Ville`, `CodePostal`, `Region`, `Pays`