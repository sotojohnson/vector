import Interactive from '../../Interactive.js';
import { getScriptName } from '../../Util.js';
let interactive = new Interactive(getScriptName());
interactive.width = 768;
interactive.height = 500;
interactive.root.style.border = "1px solid grey";
let dropdown = interactive.dropdownControl(20, 60, ["20 px", "50 px", "100 px", "150 px", "200 px"], 0);
let ellipse = interactive.ellipse(400, 250, 100, 100);
ellipse.style.fill = "purple";
ellipse.addDependency(dropdown);
ellipse.update = function () {
    ellipse.ry = +(dropdown.getCurrentSelection().split(" ")[0]);
};
ellipse.update();
//# sourceMappingURL=dropdown-control-element.js.map