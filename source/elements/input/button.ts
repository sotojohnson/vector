import Rectangle from '../svg/rectangle.js';
import Text from '../svg/text.js';
import Group from '../svg/group.js';

import Input from '../input.js';

/**
* A button that when pressed fires an onclick event.
*/
export default class Button extends Group implements Input {

  /**
  * The state of the checkbox
  */
  _count : number = 0;

  /**
  * The box that represents the area where the user clicks
  */
  box : Rectangle;

  /**
  * The text label associated with the button
  */
  label: Text;

  /**
  * Constructs a button at the position (x,y)
  */
  constructor( x:number, y:number, text:string ) {
    super();

    this.root.setAttribute('transform', `translate(${x},${y})`);
    this.root.classList.add('button');

    // Create a text element
    this.label = this.text( 0, 1, text);
    this.label.root.setAttribute('alignment-baseline','middle');
    this.label.root.style.textAnchor = 'middle';

    // TODO: why is this.text.root.textLength returning zero?
    this.box = this.rectangle( 0, -16, this.text.length*2 + 16, 32);
    this.box.root.setAttribute('rx', '2px');
    this.label.x = this.box.x + this.box.width/2;
  }

  /**
  * Fires when the user clicks the left button on the button.
  */
  set onclick( handler : (event: MouseEvent) => void ) {
    this.root.onclick = handler;
  }

  /**
  * The default behavior is to update its dependents on change.
  */
  onchange() {
    this.updateDependents();
  }
}