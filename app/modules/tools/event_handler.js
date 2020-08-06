
export class EventHandler {
    constructor() {
        this.eventListeners = [];
        this._events = [];
    }
    submitEvent(event_info) {
        let event = new Event(event_info);
        let dev_eventListener = this.eventListeners.find(listener => listener.event_type == event.type)
        dev_eventListener.run(event);
        this._events.push(event);
    }
    newEvent(event_info) {
        // NOTE: Remember that not all events will have a listener, since not all events
        // require any sort of immediate action
        let event = new Event(event_info);
        let dev_eventListener = this.eventListeners.find(hook => hook.event_type == event.type);
        dev_eventListener.run(event);
        this._events.push(event);
        console.log("EVENT HANDLER: " + event_info.type + " has occurred.");
    }
    addEventListener = (event_type, callback) => {
        this.eventListeners.push({
            event_type: event_type,
            run: callback
        });
    }
}
class Event {
    getAuthor = () => this.body.author;
    getLocation = () => this.body.location;
    getValue = () => this.body.value;
    constructor(event_info) {
        this.type = event_info.type;
        this.body = event_info.body;
    }
    // dispatch(event) {
    //     this.eventHandler.submitEvent(event);
    // }
}

