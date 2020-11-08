/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function () {
  var html,
    body,
    container,
    button,
    menu,
    menuWrapper,
    links,
    subMenus,
    i,
    len,
    focusableElements,
    firstFocusableElement,
    lastFocusableElement,
    hideBackground,
    homeLinkContainer,
    subMenuToggleButton,
    subMenuToggleButtons;

  container = document.getElementById("site-navigation");
  if (!container) {
    return;
  }

  button = document.getElementById("menu-toggle");
  if ("undefined" === typeof button) {
    return;
  }

  // Set vars.
  html = document.getElementsByTagName("html")[0];
  body = document.getElementsByTagName("body")[0];
  menu = container.getElementsByTagName("ul")[0];
  links = menu.getElementsByTagName("a");
  subMenus = menu.getElementsByTagName("ul");
  menuWrapper = document.getElementById("main-navigation-wrapper");
  var mastHead = document.getElementById("masthead");
  var homeLinkContainer = masthead.getElementsByTagName("p")[0];
  var mastHeadLink = homeLinkContainer.getElementsByTagName("a")[0];

  // main = document.getElementById("content");
  // footer = document.getElementById("colophon");
  // aside = document.getElementsByTagName("aside");

  // Hide menu toggle button if menu is empty and return early.
  if ("undefined" === typeof menu) {
    button.style.display = "none";
    return;
  }

  if (-1 === menu.className.indexOf("nav-menu")) {
    menu.className += " nav-menu";
  }

  // For webkit
  menu.setAttribute("role", "list");

  for (i = 0, len = subMenus.length; i < len; i++) {
    subMenus[i].setAttribute("role", "list");
  }

  // Small screen mobile nav

  button.onclick = function () {
    
    if (-1 !== container.className.indexOf("toggled")) {
      closeMenu(); // Close menu.
    } else {
      
      // Open nav panel
      html.className += " disable-scroll";
      body.className += " main-navigation-open";
      container.className += " toggled";
      button.className += " toggled";
      button.setAttribute("aria-label", "Close navigation panel");
      hideBackground = document.createElement("div");
      hideBackground.className += "fullScreen";
      main.setAttribute("aria-hidden", "true");
      masthead.insertAdjacentElement("afterend", hideBackground);
      homeLinkContainer.setAttribute("aria-hidden", "true");
      mastHeadLink.setAttribute("tabindex", "-1");
      
      // Set focusable elements inside main navigation.
      focusableElements = container.querySelectorAll([
        "a[href]",
        "area[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "button:not([disabled])",
        "iframe",
        "object",
        "embed",
        "[contenteditable]",
        '[tabindex]:not([tabindex^="-"])'
      ]);
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];

      // Redirect last Tab to first focusable element.
      lastFocusableElement.addEventListener("keydown", function (e) {
        if (e.keyCode === 9 && !e.shiftKey) {
          e.preventDefault();
          button.focus(); // Set focus on first element - that's actually close menu button.
        }
      });

      // Redirect first Shift+Tab to toggle button element.
      firstFocusableElement.addEventListener("keydown", function (e) {
        if (e.keyCode === 9 && e.shiftKey) {
          e.preventDefault();
          button.focus(); // Set focus on last element.
        }
      });

      // Redirect Shift+Tab from the toggle button to last focusable element.
      button.addEventListener("keydown", function (e) {
        if (e.keyCode === 9 && e.shiftKey) {
          e.preventDefault();
          lastFocusableElement.focus(); // Set focus on last element.
        }
      });
    }
  };

  // Close menu using Esc key.
  document.addEventListener("keyup", function (event) {
    if (event.keyCode == 27) {
      if (-1 !== container.className.indexOf("toggled")) {
        closeMenu(); // Close menu.
      }
    }
  });

  // Close menu clicking menu wrapper area.
  menuWrapper.onclick = function (e) {
    if (
      e.target == menuWrapper &&
      -1 !== container.className.indexOf("toggled")
    ) {
      closeMenu(); // Close menu.
    }
  };

  // Close menu function.
  function closeMenu() {
    html.className = html.className.replace(" disable-scroll", "");
    body.className = body.className.replace(" main-navigation-open", "");
    container.className = container.className.replace(" toggled", "");
    button.className = button.className.replace(" toggled", "");
    button.setAttribute("aria-label", "Open navigation panel");

    homeLinkContainer.removeAttribute("aria-hidden", "true");
    mastHeadLink.removeAttribute("tabindex", "-1");
    main.removeAttribute("aria-hidden", "true");

    // Remove the div that hides the bg when modal is opened
    if (hideBackground.parentNode) {
      hideBackground.parentNode.removeChild(hideBackground);
    }
    // Manage focus after a delay
    setTimeout(function () {
      button.focus();
    }, 350);
  }

  // Each time a menu link is focused or blurred, toggle focus.
  for (i = 0, len = links.length; i < len; i++) {
    var grandparent = links[i].parentElement.parentElement;
    if (grandparent.id !== 'primary-menu') {

       links[i].addEventListener("focus", toggleFocus, true);
       links[i].addEventListener("blur", toggleFocus, true);
    }

    var downArrowIcon = links[i].getElementsByTagName('svg')[0];
     
    if (downArrowIcon) {
       links[i].removeChild(downArrowIcon);
    }

  }

  function toggleElementFocus(e) {
    console.log('toggleElementFocus', e);
    if (-1 !== e.className.indexOf("focus")) {
      e.className = e.className.replace(" focus", "");
    } else {
      e.className += " focus";
    }
  }

  /**
   * Sets or removes .focus class on an element.
   */
  function toggleFocus() {
    var self = this;

    // Move up through the ancestors of the current link until we hit .nav-menu.
    while (-1 === self.className.indexOf("nav-menu")) {
      // On li elements toggle the class .focus.
      if ("li" === self.tagName.toLowerCase()) {
        toggleElementFocus(self);
      }

      self = self.parentElement;
    }
  }

  /**
   * Adds buttons for dropdown navigation menus on larger viewports
   */

  for (i = 0, len = subMenus.length; i < len; i++) {
    var subMenuParentLink = subMenus[i].parentNode.firstElementChild;
    var subMenuParentLinkText =
      subMenus[i].parentNode.firstElementChild.innerHTML;

    // Set up IDs
    subMenuParentLink.setAttribute("id", "subMenu-parent-" + i);
    subMenus[i].setAttribute("id", "subMenu-" + i);

    // Hide the submenus
    subMenus[i].className += " hide";

    // Insert a button with all required attributes
    var subMenuToggleButton = document.createElement("button");
    subMenuToggleButton.setAttribute("type", "button");
    subMenuToggleButton.setAttribute("id", "subMenu-toggle-" + i);
    subMenuToggleButton.setAttribute("data-toggle", "dropdown");
    subMenuToggleButton.setAttribute("data-target", "#subMenu-" + i);
    subMenuToggleButton.setAttribute("aria-expanded", false);
    subMenuToggleButton.setAttribute("aria-controls", "subMenu-" + i);
    subMenuToggleButton.classList.add("collapsed", "subMenu-toggle");
    var insertSubMenuButton = subMenus[i].parentNode;
    insertSubMenuButton.insertBefore(subMenuToggleButton, subMenus[i]);

    // Give the button a name derived from link text
    subMenuToggleButton.setAttribute(
      "aria-label",
      subMenuParentLinkText + " submenu"
    );

    // Insert content
    subMenuToggleButton.innerHTML =
      "<svg xmlns='http://www.w3.org/2000/svg' width='1.5em' height='1.5em' viewBox='0 0 24 24' focusable='false' aria-hidden='true'><path d='M9.707 18.707l6-6a.999.999 0 0 0 0-1.414l-6-6a.999.999 0 1 0-1.414 1.414L13.586 12l-5.293 5.293a.999.999 0 1 0 1.414 1.414z'></path></svg>";
  } // construct buttons

  /**
   * Toggles display of submenus
   */

  var menuToggleButtons = document.querySelectorAll("[data-toggle=dropdown]");

  for (var i = 0, s = menuToggleButtons.length; i < s; i++) {
    var thisToggleButton = menuToggleButtons[i];

    // Toggle classes and states on the current button
    thisToggleButton.addEventListener("click", function () {
      var isExpanded = this.getAttribute("aria-expanded") === 'true' ? true : false;

      toggleAttribute(this, "aria-expanded", "false", "true");
      toggleAttribute(
        this,	
        "class",
        "subMenu-toggle expanded",
        "subMenu-toggle collapsed"
      );

      if (!isExpanded) {
        var ulSibling = this.parentElement.getElementsByTagName('ul')[0];
        console.log('ul', ulSibling, ulSibling.firstElementChild);   
        if (ulSibling.firstElementChild) {
          var firstLi = ulSibling.firstElementChild;
          var liLink = firstLi.getElementsByTagName('a')[0];

          if (liLink) {
            console.log('liLink', liLink);
             
            // Set focus to the first link in the list of links
              setTimeout(function () {
                liLink.focus(); 
              }, 10);  
          }
        }
      }
   

      // Toggle classes and states on sibling buttons
      for (var j = 0, z = menuToggleButtons.length; j < z; j++) {
        if (menuToggleButtons[j] != this) {
          // Set aria-expanded to false on other dropdowns
          menuToggleButtons[j].setAttribute("aria-expanded", "false");
          // Update class on other buttons
          menuToggleButtons[j].className.replace(/(^|\s+)expanded($|\s+)/g, "");
          menuToggleButtons[j].classList.add("collapsed");

          // Get corresponding dropdown menus
          var thisToggleButton = document.querySelector(
            menuToggleButtons[j].getAttribute("data-target")
          );

          // Hide other dropdown menus
          var hide = thisToggleButton.className.replace(
            /(^|\s+)show($|\s+)/g,
            ""
          );
          thisToggleButton.className = hide;
        }
      }

      // Hide current clicked drop down
      var toggleMenu = document.querySelector(this.getAttribute("data-target"));

      if (toggleMenu.className.indexOf("show") > 0) {
        var show = toggleMenu.className.replace(/(^|\s+)show($|\s+)/g, " hide");
        toggleMenu.className = show;
      } else {
      	var hide = toggleMenu.className.replace(/(^|\s+)hide($|\s+)/g, " show");
        toggleMenu.className = hide;
      }

      // Pressing the escape key when focus is in a submenu closes it
      toggleMenu.addEventListener("keydown", function (e) {
        switch (e.which) {
          case 27:
            e.preventDefault();
            console.log("Escape key");
            
            // Reset classes on menu
            var show = this.className.replace(/(^|\s+)show($|\s+)/g, "");
            toggleMenu.className = " hide sub-menu";
            
            // Get toggle button for the menu 
            var setFocus = toggleMenu.previousSibling;
            console.log(setFocus);
            // Update class name
            setFocus.className.replace(/(^|\s+)expanded($|\s+)/g, "");
            setFocus.classList.add("collapsed");
            setFocus.setAttribute("aria-expanded", "false");
            // Set focus to the button
            setTimeout(function () {
              setFocus.focus();
            }, 350);
            break;
        } //switch
      });
    });
  }

  /**
   * Closes submenu
   */

  /**
   * Utility function to toggle attrbrutes
   */
  const toggleAttribute = (elem, attribute, state1, state2) =>
    elem.setAttribute(
      attribute,
      elem.getAttribute(attribute) === state1 ? state2 : state1
    );
})();

/**
 * Skip link focus fix.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
  var isIe = /(trident|msie)/i.test(navigator.userAgent);

  if (isIe && document.getElementById && window.addEventListener) {
    window.addEventListener(
      "hashchange",
      function () {
        var id = location.hash.substring(1),
          element;

        if (!/^[A-z0-9_-]+$/.test(id)) {
          return;
        }

        element = document.getElementById(id);

        if (element) {
          if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
            element.tabIndex = -1;
          }

          element.focus();
        }
      },
      false
    );
  }
})();