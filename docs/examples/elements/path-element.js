import Interactive from '../../Interactive.js';
import { getScriptName } from '../../Util.js';
let interactive = new Interactive(getScriptName());
interactive.width = 768;
interactive.height = 150;
interactive.root.style.border = "1px solid grey";
let line = interactive.path("M 50 50 Q 100 150 150 50");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC1lbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc291cmNlL2V4YW1wbGVzL2VsZW1lbnRzL3BhdGgtZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFdBQVcsTUFBTSxzQkFBc0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlDLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7QUFDbkQsV0FBVyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDeEIsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDekIsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLGdCQUFnQixDQUFDO0FBQ2pELElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyJ9