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
    constructor() {
        super({
            className: "nav-add",
            elementType: "a",
            name: "Add Button"
        });

        let button_label = document.createElement("span");
        button_label.innerHTML = "+";
        this.insert(button_label);
    }
}
class NavButton extends NavElement {
    iconsFolder = "/resources/icons/";
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
        icon_image.src = this.iconsFolder + this._src;
        this.insert(icon_image);
    }
}
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
export class Navbar {
    constructor() {
        this.generate();
        this.place();
    }
    generate() {
        let nav = new NavElement({
            elementType: "nav",
            id: "nav"
        });

        let nav_bar = new NavElement({
            elementType: "div",
            className: "navbar"
        });

        info_navButtons.forEach(item => {
            nav_bar.insert(new NavButton(item));            
        })

        nav.insert(new AddButton());
        nav.insert(nav_bar);

        this._container = nav;
    }
    place() {
        document.body.appendChild(this.getNode());
    }
    getNavElement() {
        return this._container;
    }
    getNode() {
        return this._container.getNode();
    }
    hide() {
        this._container.getNode().style.display = "none";
    }
    show() {
        this._container.getNode().style.display = "block";
    }
    layout_legend = {
        container: {
            name: "Navbar Container",
            id: "navbar",
            elementType: "nav",
            children: [
                {
                    name: "Universal 'Add New' Button",
                    className: "nav-add",
                    elementType: "a",
                    children: [
                        {
                            name: "Add Icon",
                            id: "add-button-label",
                            elementType: "span",
                            value: "+"
                        }
                    ]
                },
                {
                    name: "Navigation Options Container",
                    className: "nav-button-container",
                    elementType: "div",
                    children: [
                        {
                            name: "Habits",
                            icon: "/resources/icons/black_timeline.png",
                            href: "habits.html",
                            className: "nav-button",
                            elementType: "a"
                        },
                        {
                            name: "Schedule",
                            icon: "/resources/icons/black_schedule.png",
                            href: "schedule.html",
                            className: "nav-button",
                            elementType: "a"
                        },
                        {
                            name: "Search",
                            icon: "/resources/icons/black_search.png",
                            href: "#",
                            className: "nav-button",
                            elementType: "a"
                        },
                        {
                            name: "Settings",
                            icon: "/resources/icons/black_settings.png",
                            href: "settings.html",
                            className: "nav-button",
                            elementType: "a"
                        }
            ]
                }
            ]
        }

};
}