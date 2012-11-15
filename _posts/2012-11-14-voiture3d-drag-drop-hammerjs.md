# Voiture 3D - Drag & drop multi device

Toute l’équipe Eklaweb est ravie de vous annoncer qu’un projet de voiture 3D sur
laquelle elle travaillait vient d’être mis en production sur [https://www.plug-
move.com/ten-things2](https://www.plug-move.com/ten-things2). Ce projet a été
réalisé en collaboration avec l’agence de réalisation Lapompadour.

La contrainte principale était d’avoir une voiture qui pouvait être
manipulable via drag & drop et également en cliquant sur les principaux
éléments constituants la voiture.

Pour des raisons de coût, nous avons retenu non pas une solution webGL, mais
la solution majoritairement rencontrée aujourd’hui sur le web qui est le
changement d’images par CSS/javascript. Ce type d’animation est notamment
utilisé par Google sur sa page d’accueil avec les doodles, mais également
par Apple sur les animations de présentation de l’iPhone 5.

Le principe, comme il l’était aux prémices du cinéma est le défilement
d’images. Cette fois-ci, non pas sous forme de bobines, mais de sprites. Les
sprites sont des grandes images composées de petites images qui sont
affichées à l’écran une par une. L’avantage de ce procédé est d’avoir une
seule grosse image à charger, et non pas une multitude de plus petites. Le
chargement s’en trouve bien plus rapide.

Cette animation est compatible tablettes. Pour cela, nous avons du faire
quelques adaptations. La première a été de réduire la qualité des images
afin de ne pas avoir un temps de chargement trop long, puisque les tablettes
ne disposent pas toujours d’une connexion wifi. La seconde a été d’adapter
la taille des sprites puisque Safari, le navigateur par défaut d’iOS ne
supporte pas les images plus larges que 2048x2048 px et les redimensionne
automatiquement.

Enfin, nous avons géré les événements touch sur tablette et de click/drag
sur desktop avec une seule et même bibliothèque : [hammer.js]http://eightmedia.github.com/hammer.js/). L’intérêt de cette dernière est de
gérer aussi bien les événements de click et de drag sur desktop que les
événements de drag et touch sur tablette.