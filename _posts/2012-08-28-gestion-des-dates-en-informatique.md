---
layout: post
title: "Gestion des dates en informatique"
description: ""
category: 
tags: ["date", "joda-time", "java", "scala", "javascript", "timestamp"]
---
{% include JB/setup %}

La gestion des dates dans le code est un problème récurrent, et pourtant loin
 d'être trivial. Il existe en effet de nombreuses normes et représentations en
 plus du fonctionnement intrinsèquement complexe de notre système de mesure du
 temps. Les cas singuliers tels que les années bissextiles, ou la durée variable
 des mois rendent les calculs sur les dates complexes. Cet article a ainsi pour
 objectif de résumer le fonctionnement des dates et les bonnes pratiques quant à
 leur utilisation en Scala et en Javascript.

## Comprendre les dates en informatique

En informatique, de nombreux standards régissant la représentation des dates et 
des temps cohabitent. En voici deux très largement utilisés :

* L'[heure Posix][timestamp], aussi appelée Unix timestamp, est un nombre entier
 représentant le nombre de secondes écoulées depuis le 1er janvier 1970.
* Le [standard ISO-8601][standard] qui régit la représentation des dates et des 
heures. Il utilise le calendrier grégorien, et utilise le système horaire sur 24
 heures.

L'heure peut être exprimée soit en temps local, donc dépendant du fuseau 
horaire, soit en temps universel, donc établi par rapport à une référence fixe.
On appelle ce temps l'[UTC][utc] (Temps universel coordonné), remplaçant
 l'ancienne appellation standard GMT. L'UTC est basé à la fois sur le [Temps
 atomique intenational][TAI], et sur le [Temps universel][TU] lié à la rotation
 de la Terre. Ce dernier étant légèrement variable, il est nécessaire d'ajouter
 ou de retirer une [seconde intercalaire][leap_sec] (ou "leap second") lorsque
 cela est nécessaire. Le temps UTC inclut donc ce décalage.

Ainsi d'après le standard la date et l'heure s'écrivent de la manière suivante :

    2012-08-01T13:00:00Z

Le `Z` indique que le temps est UTC, sinon le temps est supposé local.

[timestamp]: http://fr.wikipedia.org/wiki/Heure_Unix
[standard]: http://fr.wikipedia.org/wiki/ISO_8601
[utc]: http://fr.wikipedia.org/wiki/Temps_universel_coordonn%C3%A9
[TAI]: http://fr.wikipedia.org/wiki/Temps_atomique_international
[TU]: http://fr.wikipedia.org/wiki/Temps_universel
[leap_sec]: http://fr.wikipedia.org/wiki/Seconde_intercalaire

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
Cette dernière fournit une implémentation simple, et sera bientôt directement
 intégrée dans Java 8.

La conception de Joda Time la rend agréable à utiliser depuis Java et Scala pour
 les raisons suivantes.

* **La simplicité**. Joda Time est simple à utiliser et permet d'écrire du code plus
lisible et moins verbeux.
* **L'immutabilité**, bien que codé en Java. Cela en fait une des rares
 bibliothèques Java agréables à utiliser en Scala.
* **L'interopérabilité** avec le JDK, ce qui rend la migration vers cette
 bibliothèque très simple.

Voici quelques exemples de cas d'utilisation classiques :

* La date et l'heure actuelle :

        DateTime dateTime = new DateTime();

* Ajouter une durée :

        DateTime dt2 = dateTime.plusDays(45).plusMonths(1);

* Choisir un format :

        dateTime.toString("E MM/dd/yyyy HH:mm:ss.SSS");

* Pour envoyer la date à un navigateur (dans un JSON par exemple) :

        datetime.toString()

Pour [plus de détail][info_joda] à propos de Joda-Time...

[jodatime]: http://joda-time.sourceforge.net/
[info_joda]: http://www.ibm.com/developerworks/java/library/j-jodatime/index.html

Regardons maintenant comment traiter les dates dans un navigateur, en 
JavaScript.


## Les dates en JavaScript

JavaScript fournit dans son implémentation un objet `Date`. Les fonctions 
disponibles, bien que plus limitées que Joda-Time, suffisent à la plupart des 
besoins. Son utilisation est simple, nécessite tout de même des précautions.

En effet, à l'origine cet objet ne supporte pas le standard ISO-8601, mais la
 RFC2822 décrivant les dates de la manière suivante :

    Wed, 28 Jul 1999 15:15:20 GMT+0100

L'utilisation classique nous donne :

* La date et l'heure actuelle :

        var d = new Date();

* A partir d'un timestamp :
    
        var d = new Date();
        d.setTime(1346071050092);

* A partir du standard de la RFC2822 :
    
        var d = new Date("Wed, 28 Jul 1999 15:15:20 GMT+0100");

Lorsque l'on crée comme cela un objet `Date`, l'heure est automatiquement
 convertie en temps local, le navigateur se chargeant de déterminer dans quel
 fuseau horaire on se trouve.

Bien que la norme ISO-8601 est maintenant censée être supportée en plus de la
 RFC2822, mais tous les navigateurs ne sont pas logés à la même enseigne. En
 effet, voici différents comportement des navigateurs :


### Firefox

Firefox accepte aussi bien les temps locaux que les temps UTC. On peut donc 
faire :

* Temps UTC (en France)

        var d = new Date("2008-03-01T13:00:00Z");
        // Sat Mar 01 2008 14:00:00 GMT+0100 (CET)

* Temps local
    
        var d = new Date("2008-03-01T13:00:00");
        // Sat Mar 01 2008 13:00:00 GMT+0100 (CET)

### Chrome

Chrome au contraire ne fait pas la différence entre temps local et UTC (testé 
sur Chrome 20), la date étant toujours considérée UTC. Cela donne :

* Temps UTC (en France)

        var d = new Date("2008-03-01T13:00:00Z");
        // Sat Mar 01 2008 14:00:00 GMT+0100 (CET)

* Temps local

        var d = new Date("2008-03-01T13:00:00");
        // Sat Mar 01 2008 14:00:00 GMT+0100 (CET)

Chrome peut également être plus tolérant sur le format de la date qui est passée
en argument, même si celui ci ne respecte pas de standard, alors que Firefox est 
strict.

### Webkit mobile

La norme ISO-8601 n'est simplement pas supportée.

En cas de besoin, on peut employer la bibliothèque JavaScript suivante
 ajoutant son support : [iso8601.js][iso8601_js]. On peut alors tranquillement
 faire : 

    var d = new Date();
    d.setTime( Date.parse("2012-08-01T13:00:00Z") );

[iso8601_js]: https://github.com/csnover/js-iso8601

## Bonnes pratiques

Voyons maintenant quelques bonnes pratiques dans des situations récurentes lors 
de l'utilisation des dates.

### Utiliser l'UTC !

Bien que les outils précédents permettent de travailler sur des temps locaux ou 
UTC, il est vivement conseillé de n'utiliser que des temps UTC, et faire la 
conversion en temps local le plus tard possible.

### Comparaison de dates

La comparaison de dates est un problème récurrent, par exemple pour calculer 
l'âge d'une personne à partir de sa date de naissance.

L'objet Date en JavaScript ne disposant pas de suffisamment de fonctionnalités
 pour le faire de manière exacte et élégante. La solution la plus simple
 (mais cependant incorrecte) est de partir de l'intervalle en secondes et de
 le convertir en jours / mois / années. Évidemment cela ne tient pas compte de
 toutes les complexités du calendrier.

Calculer la durée d'un intervalle en extrayant les valeurs des dates
 (jours, mois, année) est le plus souvent mal fait et le gain de précision
 recherché n'est en général pas nécessaire.

Joda-Time offre pour cela de nombreuses méthodes gérant de manière
 transparente les cas singuliers comme les années bissextiles. Ainsi, un
 exemple simple en Scala nous donne alors :

    val birthDate = new DateTime("1985-06-15T13:00:00Z")
    val today = new DateTime()
    val comparator = DateTimeComparator.getInstance()
    val isOfAge = comparator.compare(today, birthdate.plusYears(18))
    if (isOfAge > 0) {
      println("That budy is of age !")
    }

## Conslusion

Il ressort de cet article que qu'utiliser les dates n'est pas si évident, et
 qu'il est préférable de déléguer cela à une bibliothèque, en particulier
 Joda-Time. De plus la multiplicté des standards et leur support plus ou moins
 complet notamment par les navigateurs imposent quelques précautions.

