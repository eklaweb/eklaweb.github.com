---
layout: post
title: "Gestion des dates en informatique"
description: ""
category: 
tags: ["date", "joda-time", "java", "scala", "javascript", "timestamp"]
---
{% include JB/setup %}

Le but de cet article est de réaliser un guide sur l'utilisation des dates en 
informatique, en particulier dans le cas d'application client/serveur. Ainsi je 
commencerai par un rappel des standards régissant les dates avant de parler des 
outils à utiliser en Java/Scala et en JavaScript. Pour finir je donnerai 
quelques bonnes pratiques à observer autour des dates.

## Comprendre les dates en informatique

En informatique, deux standards cohabitent pour représenter les dates et les 
temps.

* L'[heure Posix][timestamp], aussi appelée Unix timestamp, est un nombre entier
 représentant le nombre de secondes écoulées depuis le 1er janvier 1970.
* Le [standard ISO-8601][standard] qui régit la représentation des dates et des 
heures. Il utilise le calendrier grégorien, et utilise le système horaire sur 24
 heures.

L'heure peut être exprimée soit en temps local, donc dépendant du fuseau 
horaire, soit en temps universel, donc établi par rapport à une référence fixe.
On appelle ce temps l'[UTC][utc] (Temps universel coordonné), remplaçant l'ancienne 
appellation standard GMT.

Ainsi d'après le standard la date et l'heure s'écrivent de la manière suivante :

    2012-08-01T13:00:00Z

Le `Z` indique que le temps est UTC, sinon le temps est supposé local.

[timestamp]: http://fr.wikipedia.org/wiki/Heure_Unix
[standard]: http://fr.wikipedia.org/wiki/ISO_8601
[utc]: http://fr.wikipedia.org/wiki/Temps_universel_coordonn%C3%A9

## Les dates en Java/Scala

Il existe plusieurs bibliothèques fournies dans l'implémentation officielle de 
Java permettant de manipuler les dates :

* java.util.Date
* java.sql.Date
* java.sql.Timestamp
* java.util.GregorianCalendar

Elles sont cependant complexes à utiliser, et ne respectent pas toujours le 
standard si bien qu'elles sont pour la plupart obsolètes. Il est fortement 
conseillé d'utiliser à la place une autre bibliothèque : [Joda-Time][jodatime].
Cette dernière est compatible avec le JDK, fournit une implémentation simple, et
 sera bientôt directement intégrée dans Java 8.

Voici quelques exemples de cas d'utilisation classiques :

* La date et l'heure actuelle :

        DateTime dateTime = new DateTime();

* Ajouter une durée :

        dateTime.plusDays(45).plusMonths(1);

* Choisir un format :

        dateTime.toString("E MM/dd/yyyy HH:mm:ss.SSS");

* Pour envoyer la date à un navigateur (dans un JSON par exemple) :

        datetime.toString()

Pour [plus de détail][info_joda] à propos de Joda-Time...

[jodatime]: http://joda-time.sourceforge.net/
[info_joda]: http://www.ibm.com/developerworks/java/library/j-jodatime/index.html

Regardons maintenant comment traiter les dates dans un navigateur, donc en 
JavaScript bien entendu.


## Les dates en JavaScript

JavaScript fournit dans son implémentation un objet `Date`. Les fonctions 
disponibles bien que plus limitées que Joda-Time, suffisent à la plupart des 
besoins. Son utilisation est simple, nécessite tout de même des précautions.

* La date et l'heure actuelle :

        var d = new Date();

* A partir d'un timestamp :
    
        var d = new Date();
        d.setTime(1346071050092);

* A partir du standard :
    
        var d = new Date("2012-08-01T13:00:00Z");

Lorsque l'on crée comme cela un objet `Date`, l'heure est automatiquement convertie
en temps local, le navigateur se chargeant de déterminer dans quel fuseau horaire 
on se trouve.

Il est tout de même nécessaire d'être prudent en manipulant l'objet `Date` de 
JavaScript car il ne respecte pas le standard lorsqu'il s'affiche sous forme de 
String :

    Wed, 28 Jul 1999 15:15:20 GMT+0100

Ainsi, lors d'une communication avec un serveur, utilisant par exemple 
Joda-Time, une bonne pratique est d'utiliser des timestamps afin d'éviter toute 
ambiguïté.

De plus, le comportement de l'objet Date varie d'un naivgateur à l'autre. Une 
grande prudence est donc de mise car cela peut être source d'erreurs difficiles 
à localiser.

### Firefox

Firefox accepte aussi bien les temps locaux que les temps UTC. On peut donc 
faire :

* Temps UTC (en France)

        var u = new Date("2008-03-01T13:00:00Z");
        // Sat Mar 01 2008 14:00:00 GMT+0100 (CET)

* Temps local
    
        var u = new Date("2008-03-01T13:00:00");
        // Sat Mar 01 2008 13:00:00 GMT+0100 (CET)

### Chrome

Chrome au contraire ne fait pas la différence entre temps local et UTC (testé 
sur Chrome 20), la date étant toujours considérée UTC. Cela donne :

* Temps UTC (en France)

        var u = new Date("2008-03-01T13:00:00Z");
        // Sat Mar 01 2008 14:00:00 GMT+0100 (CET)

* Temps local

        var u = new Date("2008-03-01T13:00:00");
        // Sat Mar 01 2008 14:00:00 GMT+0100 (CET)

Chrome peut également être plus tolérant sur le format de la date qui est passée
en argument, même si celui ci ne respecte pas le standard, alors que Firefox est 
strict.

## Bonnes pratiques

Voyons maintenant quelques bonnes pratiques dans des situations récurentes lors 
de l'utilisation des dates.

### Utiliser l'UTC !

Bien que les outils précédents permettent de travailler sur des temps locaux ou 
UTC, il est vivement conseillé de n'utiliser que des temps UTC, et faire la 
convertion en temps local le plus tard possible.

### Comparaison de dates

La comparaison de dates est un problème récurrent, par exemple pour calculer 
l'âge d'une personne à partir de sa date de naissance.

La mauvaise pratique consiste à extraire l'année, le mois et le jour de la date 
de naissance, et calculer l'âge avec un complexe calcul souvent faux.

Pourtant, la date et l'heure étant enregistrées sous forme de timestamp, il 
suffit de faire une simple différence (ex. en Javascript) :

    var birthDate = new Date("1985-06-15T13:00:00Z");
    var today = new Date();
    var diff = today - birthdate;               // Différence en millisecondes
    var age = diff / 1000 / 3600 / 24 / 365;    // Age en années

### Pas de temps relatif

Une bonne pratique d'éviter l'utilisation de temps relatif. Il vaut ainsi par 
exemple mieux mettre la date et l'heure de publication d'un article qu'indiquer 
la durée depuis la publication. Même au premier abord, cela semble plus lisible 
et convivial, l'ensemble perd en cohérence. De plus un screenshot perdra toute 
information sur une durée.

Pour [plus d'information][relative_date] sur la mauvaise utilisation des temps 
relatifs.

[relative_date]: http://aaronparecki.com/2012/236/article/1/you-should-not-be-displaying-relative-dates


