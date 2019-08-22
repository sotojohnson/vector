/**
* This interactive demonstrates the SVG rectangle element and its attributes.
*
* @title SVG Rectangle Element
* @date May 3, 2019
* @author Kurt Bruns
*/
import Interactive from '../../Interactive.js';
let id = 'svg-rectangle';
let interactive = new Interactive(id);
interactive.border = true;
interactive.width = 704;
let rect = interactive.rectangle(0, 0, 0, 0);
let c1 = interactive.control(150, 100);
let c2 = interactive.control(450, 200);
let text = interactive.text(25, 275, "");
c2.update = function () {
    this.x += c1.dx;
    this.y += c1.dy;
};
c2.addDependency(c1);
rect.update = function () {
    this.x = Math.min(c1.x, c2.x);
    this.y = Math.min(c1.y, c2.y);
    this.width = Math.max(c1.x, c2.x) - rect.x;
    this.height = Math.max(c1.y, c2.y) - rect.y;
};
rect.update();
rect.addDependency(c1);
rect.addDependency(c2);
// TODO: this is rather hacky, and probably best replaced by implementing the
// tspan element in our SVG wrapper class.
text.update = function () {
    let tag = `<tspan style="fill:purple">rect</tspan>`;
    let x = `<tspan style="fill:#ab6f00">x</tspan>`;
    let y = `<tspan style="fill:#ab6f00">y</tspan>`;
    let width = `<tspan style="fill:#ab6f00">width</tspan>`;
    let height = `<tspan style="fill:#ab6f00">height</tspan>`;
    this.contents = `&lt;${tag} ${x}="${rect.x.toFixed(0)}
                              ${y}="${rect.y.toFixed(0)}
                              ${width}="${rect.width.toFixed(0)}
                              ${height}="${rect.height.toFixed(0)}"&gt`;
};
text.update();
text.addDependency(rect);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLXJlY3RhbmdsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9leGFtcGxlcy9zdmcvc3ZnLXJlY3RhbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0VBTUU7QUFFRixPQUFPLFdBQVcsTUFBTSxzQkFBc0IsQ0FBQztBQUUvQyxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQUM7QUFDekIsSUFBSSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdEMsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFFMUIsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxJQUFJLEVBQUUsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QyxJQUFJLEVBQUUsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QyxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFMUMsRUFBRSxDQUFDLE1BQU0sR0FBRztJQUNWLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNoQixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDbEIsQ0FBQyxDQUFBO0FBQ0QsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyQixJQUFJLENBQUMsTUFBTSxHQUFHO0lBQ1osSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUE7QUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFdkIsNkVBQTZFO0FBQzdFLDBDQUEwQztBQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHO0lBQ1osSUFBSSxHQUFHLEdBQUcseUNBQXlDLENBQUM7SUFDcEQsSUFBSSxDQUFDLEdBQUcsdUNBQXVDLENBQUM7SUFDaEQsSUFBSSxDQUFDLEdBQUcsdUNBQXVDLENBQUM7SUFDaEQsSUFBSSxLQUFLLEdBQUcsMkNBQTJDLENBQUM7SUFDeEQsSUFBSSxNQUFNLEdBQUcsNENBQTRDLENBQUM7SUFDMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dDQUN2QixDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dDQUN2QixLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dDQUMvQixNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4RSxDQUFDLENBQUE7QUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDIn0=
