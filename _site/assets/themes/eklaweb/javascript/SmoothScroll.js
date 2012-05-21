/*
---

script: SmoothScroll.js

name: SmoothScroll

description: Class for creating a smooth scrolling effect to all internal links on the page.

license: MIT-style license

authors:
  - Valerio Proietti
  - Godefroy de Compreignac

requires:
  - Core/Slick.Finder
  - /Fx.Scroll

provides: [FSmoothScroll]

*/

window.addEvent('load', function() {
    var SmoothScroll = new Class({

        Extends: Fx.Scroll,

        initialize: function(options){
            var location = window.location.href.match(/^[^#]*/)[0] + '#';
            this.doc = window.getDocument();
            this.parent(this.doc, options);
            this.options.offset = {
                x: 0,
                y: - $$('nav')[0].offsetHeight
            };

            $$(this.doc.links).each(function(link){
                if (link.href.indexOf(location) != 0) return;
                var anchor = link.href.substr(location.length);
                if (anchor) this.useLink(link, anchor);
            }, this);

            this.addEvent('complete', function(){
                window.location.hash = this.anchor;
                this.element.scrollTo(this.to[0], this.to[1]);
            }, true);
        },

        useLink: function(link, anchor){
            link.addEvent('click', function(event){
                event.preventDefault();
                this.toAnchor(anchor);
            }.bind(this));

            return this;
        },

        toAnchor: function(anchor){
            var el = $(anchor);
            if (!el) return;
            el = el.getElement('h1') || el;
            this.toElement(el);
            this.anchor = anchor;

            return this;
        }
    });

    var scroller = new SmoothScroll({duration: 300});

    var hash = window.location.hash;
    if(hash != ''){
        scroller.toAnchor(hash.substring(1));
    }

});
