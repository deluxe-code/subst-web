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
    constructor() {
        this._eventHandler = new EventHandler();
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
        document.body.appendChild(this.getNode());
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
    constructor(info) {
        this._children = [];
        this._node = document.createElement(info.elementType);
        this._className = info.className;
        this._id = info.id;
        this._name = info.name;

        if (info.className) {
            this._node.className = info.className;
        }
        if (info.id) {
            this._node.id = info.id;
        }
        return this;
    }
    getChildren() {
        return this._children;
    }
    getName() {
        return this._name;
    }
    getID() {
        return this._id;
    }
    getClassName() {
        return this._className;
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
        this._children.push(element);
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

        this.getNode().addEventListener("click", event => {
            NavbarInstance.toggleMenu();
        });

        this.insert(button_label);
    }
}
class AddMenuItem extends NavElement {
    constructor(info) {
        super({
            className: "add-item",
            elementType: "div"
        })

        this._label = info.label;
        this._href = info.href;
        this._color = info.color;

        this._node.innerHTML = this._label;
        this._node.addEventListener("click", function() {
            console.log(this._node + " was clicked!");
        });
    }
}
class NavButton extends NavElement {
    constructor(info) {
        super({
            className: "nav-button",
            elementType: "a",
            name: info.name
        });
        this._href = info.href;
        this._src = info.icon.src;
        this._imgAlt = info.icon.alt;

        let icon_image = document.createElement("img");
        icon_image.alt = this._imgAlt;
        icon_image.src = iconsFolder + this._src;
        this.insert(icon_image);
    }
}

