
export class EventHandler {
    constructor(parent) {
        this._parent = parent;
        this.currentHooks = [];
        this._events = [];
    }
    newEvent(event_info) {
        // NOTE: Remember that not all events will have a listener, since not all events
        // require any sort of immediate action
        let event = new Event(event_info);
        this.currentHooks.forEach(listener => {
            if (listener.event_type == event.type) {
                listener.run(event);
            }
        });
        this._events.push(event);
        console.log("EVENT HANDLER: " + event_info.type + " has occurred.");
    }
    listenFor = (event_type, callback) => {
        // NOTE: Arrow function due to an obfuscation problem in Card.getTools();
        this.currentHooks.push({
            event_type: event_type,
            run: callback
        });
    }
    // getParent() {
    //     return this._parent;
    // }

}
class Event {
    constructor(event_info) {
        this.type = event_info.type;
        this.body = event_info.body;
    }

    // getType() {
    //     return this.type;
    // }
    // getBody() {
    //     return this.body;
    // }
    getAuthor() {
        return this.body.author;
    }
    getValue() {
        if (this.body.value != null) {
            return this.body.value;
        } else {
            return "NO_TARGET_FOUND";
        }
    }
}

