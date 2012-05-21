
window.addEvent("domready", function() {

    // Menu
    var navBar = $("nav"),
        initialPos = navBar.offsetTop,
        menuItems = [];
    window.addEvent("scroll", function(e) {
        var scrollTop = window.getScroll().y;

        if(menuItems.length > 0) {
            var activeItem,
                maxVisiblePerc = -1,
                windowHeight = window.getSize().y;
            menuItems.each(function(item){
                var element = $(item),
                    offsetTop = element.offsetTop,
                    offsetHeight = element.offsetHeight,
                    visiblePerc = Math.max(0, Math.min(scrollTop + windowHeight, offsetHeight + offsetTop) - Math.max(scrollTop, offsetTop)) / offsetHeight;
                if(visiblePerc > maxVisiblePerc) {
                    activeItem = item;
                    maxVisiblePerc = visiblePerc;
                }
            });
            $$("nav a").removeClass("active");
            $("link-"+activeItem).addClass("active");
        }

        if(scrollTop > initialPos && navBar.getStyle("position") != "fixed") {
            navBar.setStyles({
                position: "fixed",
                top: "0px"
            });
        } else if(scrollTop <= initialPos && navBar.getStyle("position") != "absolute") {
            navBar.setStyles({
                position: "absolute",
                top: initialPos + "px"
            });
        }
    });

    // Legals
    var legalsSlide = new Fx.Slide("legals", {
        onComplete: function(){
            new Fx.Scroll(window).toElement("legals");
        }
    }).hide();
    $("link-legals").addEvent("click", function(){
        legalsSlide.toggle();
    });

});
