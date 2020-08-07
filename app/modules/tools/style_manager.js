class StyleManager {
  addState = (newStateName, newStyles) => this.states[newStateName] = newStyles;
  setStyles = styles => Styles.assign(styles, this.node);
  setState = stateName => this.setStyles(this.states[stateName]);
  constructor(element) {
    this.states = {};
    this.node = element;
    element.styleManager = this;
  }
}

export const Styles = {
  getManager: element => (element?.styleManager) ? element.styleManager : new StyleManager(element),
  assign: function(styles, recipient) {
    Object.keys(styles).forEach(key => {
    recipient.style[key] = styles[key];
    })
  }
}