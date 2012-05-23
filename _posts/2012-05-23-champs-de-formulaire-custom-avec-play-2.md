---
layout: post
title: "Champs de formulaire custom avec Play! 2"
description: ""
category: 
tags: ["scala", "playframework", "typeclass"]
---
{% include JB/setup %}

## Gérer un formulaire avec Play!

Play! nous permet de gérer assez simplement les champs de formulaire.
Consultez la [documentation Play! pour les formulaires](
http://www.playframework.org/documentation/2.0/ScalaForms) si
vous avez besoin de vous rafraîchir la mémoire.


    import play.api.data._
    import play.api.data.Forms._
    
    val loginForm = Form(
      tuple(
        "email" -> text,
        "password" -> text
      )
    )

Ici on définit un formulaire contenant deux champs de texte et générant un
*tuple* ``(String,String)``.

Il existe plusieurs types de champs (``text``, ``number``, ``longNumber``, ``jodaDate``, …).
Ces méthodes ne sont en fait que des *helpers*. La forme générale est un appel
à la méthode générique ``of[T]``.

On a donc une équivalence entre les deux bouts de code suivants :

    val loginForm = Form(
      tuple(
        "email" -> text,
        "password" -> text
      )
    )

et

    val loginForm = Form(
      tuple(
        "email" -> of[String],
        "password" -> of[String]
      )
    )

Le but va évidemment d'appeler ``of[T]`` avec des types perso. Play! le permet
grâce au mécanisme de **TypeClass**. Ce mécanisme permet de placer une
contrainte sur le type ``T``.

## Les TypeClass en scala

Les *typeclasses* viennent de Haskell où elles sont un *core construct* du
langage. On les retrouve cependant en scala, mais il faut le faire à la main.

Une typeclass définit un ensemble de méthodes qui doivent fonctionner avec le
type. Par exemple, on peut s'intéresser aux **monoides**. Un type ``T`` est un
monoide s'il existe une opération ``(T, T) => T`` et un élément neutre 
pour cette opération. Par exemple les entiers naturels avec l'addition et 0,
les chaines de caractères avec la concaténation et ``""``.

On peut s'amuser à définir cette typeclass en scala :

    trait Monoid[T] {
        def mempty: T
        def mappend(a: T, b: T): T
    }

On peut ensuite décrire comment chaque type est une instance de cette
typeclass. L'astuce sera de rendre ces instances **implicites** pour qu'elles
soient passées automatiquement aux fonctions qui en ont besoin, sans alourdir
le code.

    implicit val stringMonoid = new Monoid[String] {
        val mempty = ""
        def mappend(a: String, b: String): String = a + b
    }

    implicit val intMonoid = new Monoid[Int] {
        val mempty = 0
        def mappend(a: Int, b: Int): Int = a + b
    }

Dans une méthode, quand on veut s'assurer qu'une valeur instancie une
typeclass, il suffit de rajouter un argument implicite.

    def fooBarIdentity[T](a: T)(implicit val m: Monoid[T]) = {
        m.mappend(a, m.mempty)
    }


**Et voilà !**

## On revient aux formulaires

Dans notre cas, il s'agit de s'assurer qu'il est
possible de passer d'une chaine de caractères (la valeur fournie par le champ
de formulaire) à une valeur de type ``T`` et vice-versa.

La typeclass qui s'occupe de ça dans play s'appelle ``Formatter[T]``. C'est
visible dans la signature de ``of[T]``:

    def of[T](implicit binder: Formatter[T])


La typeclass formatter définit trois opérations :

    trait Formatter[T] {
    
      /**
    * The expected format of `Any`.
    */
      val format: Option[(String, Seq[Any])] = None
    
      /**
    * Binds this field, i.e. constructs a concrete value from submitted data.
    *
    * @param key the field key
    * @param data the submitted data
    * @return Either a concrete value of type T or a set of error if the binding failed.
    */
      def bind(key: String, data: Map[String, String]): Either[Seq[FormError], T]
    
      /**
    * Unbinds this field, i.e. transforms a concrete value to plain data.
    *
    * @param key the field ke
    * @param value the value to unbind
    * @return either the plain data or a set of errors if unbinding failed
    */
      def unbind(key: String, value: T): Map[String, String]
    }

Les commentaires parlent d'eux mêmes.

Pour faire vos champs custom, il suffit juste de créer l'instance de
``Formatter`` qui va bien, et ensuite tout roule :)

Par exemple (un exemple alakon qui pourrait sans doute être fait autrement et
plus simplement) :

    sealed abstract trait Gender
    case object Male extends Gender
    case object Female extends Gender

    implicit val GenderBinder = new Formatter[Gender] {
        def bind(key, String, data: Map[String, String]: Either[Seq[FormError], T] = {
             data.get(key) flatMap { v =>
                Seq(Male, Female) find { _.toString() == v }
             }.toRight(Seq(FormError(key, "error.required")))
        }

        def unbind(key: String, value: Gender): Map[String, String] = Map(key -> value.toString())
    }

Seule petite subtilité, le ``toRight`` sur un ``Option`` :

    Some(10).toRight("missing") == Right(10)
    None.toRight("missing") == Left("missing")


La plupart des types courants ont déjà leur instance de ``Formatter``, mais c'est
souvent nécessaire d'adapter le formulaire à un objet métier.

Si vous voulez voir quels types sont déjà supportés, ou juste vous inspirer,
c'est par là : [``Format.scala`` sur github](https://github.com/playframework/Play20/blob/master/framework/src/play/src/main/scala/play/api/data/format/Format.scala)
