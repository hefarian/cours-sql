/*global $,Uint8Array,SQL,ace,marked,hljs,document,window,XMLHttpRequest*/
(function () {
    "use strict";
    
    var ecran = $("#interface"), hauteur, db, editeur, petit = false;
    
    function tropPetit() {
        petit = true;
        ecran.html("Taille de la fenêtre inadaptée à cette application");
    }
    
    marked.setOptions({
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });
    
    // Transformation du résultat d'une requête en une table HTML
    function sql2table(resultat, identifiant, tableContenu) {
        var table, tableHead, tableAttributs, tableLignes;
        if (resultat) {
            table = $("<table>").attr("id", identifiant).attr("class", "display");
            tableHead = $("<thead>");
            table.append(tableHead);
            tableAttributs = $("<tr>");
            tableHead.append(tableAttributs);
            $.each(resultat.columns, function (i, e) {
                tableAttributs.append($("<th>").html(e));
            });
            
            tableLignes = $("<tbody>");
            table.append(tableLignes);
            $.each(resultat.values, function (i, t) {
                var ligne = $("<tr>");
                $.each(t, function (i, e) {
                    var td = $("<td>").html(e);
                    if ((tableContenu) && (i === 0)) {
                        td.click(function () {
                            editeur.setValue("SELECT *\n\tFROM " + e + ";");
                            editeur.gotoLine(1);
                        });
                    }
                    ligne.append(td);
                });
                tableLignes.append(ligne);
            });
        }
        return (table);
    }
    
    // Exécution de la requête SQL proposé
    function execution() {
        var sql, resultat, table, erreur;
        $("#resultat").children().remove();
        if (!db) {
            $("#resultat").append($("<div>").html("<strong>Attention :</strong><br>Base de données non choisie").css("color", "red"));
        } else {
            sql = editeur.getValue();
            try {
                resultat = db.exec(sql)[0];
            } catch (error) {
                erreur = true;
                $("#resultat").html($("<div>").html("<strong>Erreur :</strong><br>" + error.message));
            } finally {
                if (!resultat && !erreur) {
                    erreur = true;
                    $("#resultat").html($("<div>").html("<strong>Attention :</strong><br>Aucun résultat trouvé."));
                }
                if (!erreur) {
                    if (resultat.length) {
                        $("#resultat").html($("<div>").html(resultat));
                    } else {
                        table = sql2table(resultat, "tablesql", false);
                        table.attr("class","table table-striped table-bordered");
                        if (table) {
                            $("#resultat").append(table);
                            $("#tablesql").DataTable({
                                ordering: false,
                                paging: false,
                                scrollY: ($("#resultat").height() - 170) + "px",
                                scrollCollapse: true,
                                autoWidth: false,
                                scrollX: true, // $("#resultat").width() + "px",
                                dom: 'Bfrtip',
                                searching: true,
                                buttons: [
                                    'copy', 'csv', 'pdf'
                                ]
                            });
                        }
                    }
                }
            }
            editeur.focus();
        }
    }
    
    // Affichage du contenu d'une base de données
    function afficherContenu() {
        var affichage = $("#contenu").css("display");
        if (affichage === "none") {
            $("#contenu").css("display", "block");
            $("#choixBD").css("display", "none");
            $("#lecon").css("display", "none");
            $("#tables").addClass("active");
        } else {
            $("#contenu").css("display", "none");
            $("#choixBD").css("display", "block");
            $("#lecon").css("display", "block");
            $("#tables").removeClass("active");
        }
        editeur.focus();
    }
    
    // Affichage du schéma d'une base de données
    function afficherSchema() {
        var png = "bases/" + $("#bdd").html().replace(".sqlite", "") + ".png";
        window.open(png);
    }
    
    // Lecture d'une base de données
    function lecture(fichier) {
        $("#bdd").html(fichier.replace("bases/", "").replace(".sqlite", ""));
        $("#lancer").css("visibility", "hidden");
        $("#tables").css("visibility", "hidden");
        $("#schema").css("visibility", "hidden");
        $("#resultat").children().remove();
        editeur.setValue("");
        $("#contenu").children().remove();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", fichier, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            var uInt8Array = new Uint8Array(this.response), contenu, html;
            initSqlJs({ locateFile: filename => `./lib/wasm/${filename}` }).then(function(SQL){
                db = new SQL.Database(uInt8Array);
                $("#lancer").css("visibility", "visible");
                $("#tables").css("visibility", "visible");
                $("#schema").css("visibility", "visible");
                
                contenu = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table'");
                html = sql2table(contenu[0], "tabtables", true);
                $("#contenu").html(html);
                $("#tabtables").DataTable({
                    "paging":   false,
                    "ordering": false,
                    "info":     false,
                    "searching": false
                });
                editeur.focus();
            });
        };
        xhr.send();
    }

    // Création de l'interface en trois zones
    function initialisation() {
        var information = $("<div>").attr("id", "information"),
            contenu = $("<div>").attr("id", "contenu"),
            requete = $("<div>").attr("id", "requete"),
            requetesql = $("<div>").attr("id", "requetesql"),
            resultat = $("<div>").attr("id", "resultat"),
            droite = $("<div>").attr("id", "droite");
        
        information.append(contenu);
        requete.append(requetesql);
        droite.append(requete);
        droite.append(resultat);
        ecran.children().remove();
        ecran.append(information);
        ecran.append(droite);
        
        editeur = ace.edit("requetesql");
        editeur.setTheme("ace/theme/sqlserver");
        editeur.getSession().setMode("ace/mode/sql");
        editeur.setOption("showPrintMargin", false);
        editeur.focus();

        // Une fois l'interface en place, on évite qu'un utilisateur par hasard recharge la page
        $(document.body).on("keydown", this,
            (e) => {
                // F5 ou Controle+R ou Alt+Gauche
                if (e.keyCode == 116 || (e.keyCode == 82 && e.ctrlKey) || (e.keyCode == 37 && e.altKey))
                    e.preventDefault();
            }
        );
    }
    
    // Mise en place d'une interface de requêtage simple, avec choix de la base de données à gauche (et affichage de l'information)
    function requetage() {
        var bds = $("<div>").attr("id", "choixBD").css("text-align", "center"), liste;
        initialisation();
        $("#titre").html("Requêtage direct");
        
        liste = ["exemple.sqlite", "Comptoir2000.sqlite", "Gymnase2000.sqlite", "Chinook.sqlite", "world.sqlite", "ca.sqlite", "TourDeFrance.sqlite", "sakila.sqlite", "stages.sqlite", "CabinetMedical.sqlite", "bibliotheque.sqlite"];
        
        $.each(liste, function (i, e) {
            var bouton = $("<button>").html(e).click(function () {
                $("button.btn btn-primary").removeClass("btn btn-primary");
                lecture("bases/" + e);
                $(this).addClass("btn btn-primary");
            });
            bds.append(bouton);
            bds.append($("<br>"));
        });
        
        $("#information").append(bds);
    }
    
    
    // Chargemet d'un cours et affichage de celui-ci
    function lancementCours(cours) {
        initialisation();
        $.getJSON("cours/" + cours + "/" + cours + ".json", function (donnees) {
            var queue,
                lecon = $("<div>").attr("id", "lecon"),
                items = $("<div>").attr("id", "items"),
                textes = $("<div>").attr("id", "textes");
            
            $("#titre").html(donnees.intitule);
            lecture("bases/" + donnees.base);
            
            // Lecture des fichiers md
            queue = donnees.fichiers.map(function (fic) {
                var nomfic = "cours/" + cours + "/" + fic + ".md";
                return $.get(nomfic);
            });
            
            // Intégration de ces fichiers md dans la div de lecon
            $.when.apply(null, queue).done(function () {
                var item, texte;
                $.each(arguments, function (i, e) {
                    item = $("<button>").html(i + 1).attr("class", "btn btn-secondary");
                    texte = $("<div>").html(marked(e[0]));
                    item.click(function () {
                        var num = +$(this).html();
                        $("#textes div").css("display", function (iclick) {
                            if ((iclick + 1) === num) {
                                return "block";
                            } else {
                                return "none";
                            }
                        });
                        $("#items button").removeClass("btn-primary");
                        $(this).addClass("btn-primary");
                        $("#information").scrollTop(0);
                    });
                    if (i !== 0) {
                        texte.css("display", "none");
                    } else {
                        item.addClass("btn-primary");
                    }
                    items.append(item);
                    textes.append(texte);
                });
                lecon.append(items).append(textes);
                $("#information").append(lecon);
                $("#textes pre").click(function () {
                    var code = $(this).find("code"),
                        sql = code.html();
                    if (code.hasClass("lang-sql")) {
                        sql = sql.replace(/<span class="hljs-keyword">/g, '');
                        sql = sql.replace(/<span class="hljs-string">/g, '');
                        sql = sql.replace(/<span class="hljs-number">/g, '');
                        sql = sql.replace(/<span class="hljs-built_in">/g, '');
                        sql = sql.replace(/<span class="hljs-literal">/g, '');
                        sql = sql.replace(/&lt;/g, '<');
                        sql = sql.replace(/&gt;/g, '>');
                        sql = sql.replace(/<\/span>/g, '');
                        $("#resultat").children().remove();
                        editeur.setValue(sql);
                        editeur.gotoLine(1);
                    }
                });
            });
            
        });
    }
    
    // Ecran de début
    function debut() {
        var choix = $("<div>").attr("id", "choixAccueil").attr("class", "row"),
            logo = $("<div>").attr("id", "logo"),
            choix1 = $("<div>").attr("id", "choix1"),
            choix2 = $("<div>").attr("id", "choix2"),
            choix3 = $("<div>").attr("id", "choix3");
        ecran.children().remove();
        $("#titre").html("");
        $("#bdd").html("");
        $("#lancer").css("visibility", "hidden");
        $("#tables").css("visibility", "hidden").removeClass("active");
        $("#schema").css("visibility", "hidden");
        
        logo.append("<img src=logo.png>");

        choix1.append($("<button class='btn btn-primary'>").html("1 - Requêtage simple").click(function () { lancementCours("1-requetage-simple"); }));
        choix1.append("<br>");
        choix1.append($("<button class='btn btn-primary'>").html("2 - Calculs et fonctions").click(function () { lancementCours("2-calculs-fonctions"); }));
        choix1.append("<br>");
        choix1.append($("<button class='btn btn-primary'>").html("3 - Agrégats").click(function () { lancementCours("3-agregats"); }));
        choix1.append("<br>");
        choix1.append($("<button class='btn btn-info'>").html("Récapitulatif 1").click(function () { lancementCours("recapitulatif1"); }));
        choix1.append("<br>");
        choix1.append($("<button class='btn btn-light'>").html("TP numéro 1").click(function () { lancementCours("tpnote1"); }));

        choix2.append($("<button class='btn btn-primary'>").html("4 - Jointures").click(function () { lancementCours("4-jointures"); }));
        choix2.append("<br>");
        choix2.append($("<button class='btn btn-primary'>").html("5 - Sous-requêtes").click(function () { lancementCours("5-sous-requetes"); }));
        choix2.append("<br>");
        choix2.append($("<button class='btn btn-primary'>").html("6 - Opérations ensemblistes").click(function () { lancementCours("6-ensemblistes"); }));
        choix2.append("<br>");
        choix2.append($("<button class='btn btn-info'>").html("Récapitulatif 2").click(function () { lancementCours("recapitulatif2"); }));
        choix2.append("<br>");
        choix2.append($("<button class='btn btn-light'>").html("TP numéro 2").click(function () { lancementCours("tpnote2"); }));
        
        choix3.append($("<button class='btn btn-primary'>").html("7 - Fenêtrage").click(function () { lancementCours("7-fenetrage"); }));
        choix3.append("<br>");
        choix3.append($("<button class='btn btn-primary'>").html("8 - Vues").click(function () { lancementCours("8-vues"); }));
        choix3.append("<br>");
        choix3.append($("<button class='btn btn-primary'>").html("9 - Triggers").click(function () { lancementCours("9-triggers"); }));
        choix3.append("<br>");
        choix3.append($("<button class='btn btn-primary'>").html("10 - Indexes").click(function () { lancementCours("10-indexes"); }));
        choix3.append("<br>");
        choix3.append($("<button class='btn btn-primary'>").html("11 - Transactions").click(function () { lancementCours("11-transactions"); }));
        choix3.append("<br>");

        //choix.append("<br>");
        choix.append(logo);
        choix.append(choix1);
        choix.append(choix2); 
        choix.append(choix3);
        
        
        //choix.append("<br>");
        // choix.append($("<button class='btn btn-info'>").html("Requêtage direct").click(requetage));
        ecran.append(choix);
    }

    $("#accueil").click(debut);
    $("#lancer").click(execution);
    $("#tables").click(afficherContenu);
    $("#schema").click(afficherSchema);
    
    // Permet l'exécution de la requête via CTRL + Enter
    $(document).on('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && (e.which === 13)) {
            execution();
        }
    });
    
    // Permet la gestion du changement de taille de la fenêtre
    $(window).on("resize", function () {
        hauteur = (window.innerHeight - $("header").height() - $("footer").height());
        ecran.css("height", hauteur + "px");
        if (hauteur < 400) {
            tropPetit();
        } else {
            if (petit) {
                petit = false;
                debut();
            }
        }
    });

    hauteur = (window.innerHeight - $("header").height() - $("footer").height());
    ecran.css("height", hauteur + "px");
    if (hauteur < 400) {
        tropPetit();
    } else {
        debut();
    }

}());
