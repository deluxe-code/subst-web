import { EventHandler } from "./event_handler.js";

const iconsFolder = "/resources/icons/";
const info_navButtons = [
    {
        name: "Timeline",
        href: "timeline.html",
        icon: {
            src: "black_timeline.png",
            alt: "Timeline"
        }
    },
    {
        name: "Schedule",
        href: "schedule.html",
        icon: {
            src: "black_schedule.png",
            alt: "Schedule"
        }
    },
    {
        name: "Search",
        href: "#",
        icon: {
            src: "black_search.png",
            alt: "Search"
        }
    },
    {
        name: "Settings",
        href: "settings.html",
        icon: {
            src: "black_settings.png",
            alt: "Settings"
        }
    }
];
const info_addButtons = [
    {
        label: "New Entry",
        href: "#create_entry",
        color: "black"
    },
    {
        label: "New Schedule",
        href: "#new_schedule",
        color: "black"
    },
    {
        label: "New Dose",
        href: "#new_dose",
        color: "black"
    }
]

export class Navbar {
    #eventHandler;
    constructor() {
        this.#eventHandler = new EventHandler();
        this.generate();
        this.place();
    }
    toggleMenu() {
        console.log("TOGGLE THE MENU!!");
    }
    generate() {
        let nav = new NavElement({
            elementType: "div",
            id: "nav"
        });

        let add_button = new AddButton(this);
        let add_menu = new NavElement({
            id: "add-menu",
            elementType: "div"
        });
        info_addButtons.forEach(addItem => {
            add_menu.insert(new AddMenuItem(addItem));
        });

        // Tie the add menu to the Navigation Bar so it can be accessed by the AddButton
        this._add_menu = add_menu;

        let nav_bar = new NavElement({
            elementType: "nav",
            className: "navbar"
        });

        info_navButtons.forEach(navItem => {
            nav_bar.insert(new NavButton(navItem));
        })


        nav.insert(add_button);
        nav.insert(nav_bar);

        this._NavElement = nav;
    }
    place() {
        document.body.appendChild(this._NavElement.getNode());
    }
    getNavElement() {
        return this._NavElement;
    }
    getNode() {
        return this._NavElement.getNode();
    }
    hide() {
        this._NavElement.getNode().style.display = "none";
    }
    show() {
        this._NavElement.getNode().style.display = "block";
    }
}
class NavElement {
    #children;
    #className;
    #id;
    #name;
    constructor(info) {
        this.#children = [];
        this._node = document.createElement(info.elementType);
        this.#className = info.className;
        this.#id = info.id;
        this.#name = info.name;

        if (info.className) {
            this._node.className = info.className;
        }
        if (info.id) {
            this._node.id = info.id;
        }
        return this;
    }
    getChildren() {
        return this.#children;
    }
    getName() {
        return this.#name;
    }
    getID() {
        return this.#id;
    }
    getClassName() {
        return this.#className;
    }
    getNode() {
        return this._node;
    }
    setID(id) {
        this._node.id = id;
    }
    setClassName(className) {
        this._node.className = className;
    }
    insert(element) {
        if (element instanceof NavElement) {
            this._node.appendChild(element.getNode());
        } else {
            this._node.appendChild(element);
        }
        this.#children.push(element);
    }
}
class AddButton extends NavElement {
    constructor(NavbarInstance) {
        super({
            className: "nav-add",
            elementType: "a",
            name: "Add Button"
        });

        let button_label = document.createElement("span");
        button_label.innerHTML = "+";

        super.getNode().addEventListener("click", event => {
            NavbarInstance.toggleMenu();
        });

        super.insert(button_label);
    }
}
class AddMenuItem extends NavElement {
    #label;
    #href;
    #color;


    constructor(info) {
        super({
            className: "add-item",
            elementType: "div"
        })

        this.#label = info.label;
        this.#href = info.href;
        this.#color = info.color;
        console.log(this);
        this._node.innerHTML = this.#label;
        this._node.addEventListener("click", function() {
            console.log(this._node + " was clicked!");
        });
    }
}
class NavButton extends NavElement {
    #href;
    #src;
    #imgAlt;

    constructor(info) {
        super({
            className: "nav-button",
            elementType: "a",
            name: info.name
        });
        this.#href = info.href;
        this.#src = info.icon.src;
        this.#imgAlt = info.icon.alt;
        this._node.href = info.href;
        let icon_image = document.createElement("img");
        icon_image.alt = this.#imgAlt;
        icon_image.src = iconsFolder + this.#src;
        super.insert(icon_image);
    }
}

