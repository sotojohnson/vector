/**
* @ignore true
*/

// import Interactive from 'https://unpkg.com/@interactive-svg/library/dist/Interactive.js';
import {Interactive, Point, Control, Path, Circle, AnimationPlayer} from '../../index.js';
import { TAU } from '../../util/constants.js';

export interface Configuration {
	radius?:number;
	width?:number;
	margin?:number;
	angle?: number;
	ticStep?: number;
	ticStepBig?: number;
	labelStep?: number;
	min?:number;
	max?:number;
	value?:number;
	loop?:boolean;
}

export class DegreesFigure extends AnimationPlayer {

	static default : Configuration = {
		radius: 150,
		width: 400,
		margin:50,
		ticStep: 2.5,
		ticStepBig: 10,
		labelStep: 30,
		min: 0,
		max: TAU,
		value: TAU/8,
		loop: true
	}

	constructor( id :string, options = DegreesFigure.default) {

		let config = { ...DegreesFigure.default, ...options };

    super(id, config );

    let figure = new DegreesBaseFigure(this.canvas, config);

    this.scrubber.addDependency(figure.point);

    this.scrubber.update = () => {
      let angle = figure.getAngle();
      this.scrubber.value = angle;
    };

    this.scrubber.pushOnChange( () => {
      figure.setAngle(this.scrubber.value);
    });
	}

}

interface BaseFigureOptions {
	angle?: number;
	radius?: number;
	margin?: number;
	width?: number;
	ticStep?: number;
	ticStepBig?: number;
	labelStep?: number;
}

export class DegreesBaseFigure extends Interactive {

	point:Point;
	radius:number;
	margin:number;
	width:number;
  offset: number;
  ticStep: number;
	labelStep: number;
  ticStepBig: number;

	static defaultOptions:BaseFigureOptions = {
		angle: TAU/8,
		radius: 110,
		margin: 60,
		width:400,
		ticStep: 2.5,
		ticStepBig: 10,
		labelStep: 30
	}

	constructor(idOrHTMlElement:string|HTMLElement, options?:BaseFigureOptions  ) {

		// combine the default configuration with the user's configuration
		let config = { ...DegreesBaseFigure.defaultOptions, ...options };

		// call the constructor
		let width = 2*config.radius + 2*config.margin;
		super(idOrHTMlElement, {
			width: width,
			height: width + 50,
			originX: width/2,
			originY: width/2,
			border: false
		});

		// set other variables
		this.radius = config.radius;
		this.margin = config.margin;
		this.ticStep = config.ticStep;
		this.ticStepBig = config.ticStepBig;
		this.labelStep = config.labelStep;
		// this.classList.add('default');

		// Draw the circle with the provided number of steps
		this.initializeTemplate();

		let group = this.group();
		group.style.strokeOpacity = '.2';
		group.root.setAttribute('vector-effect','non-scaling-stroke');

		// Create the controls & define dependency functions
		this.point = new Point(this.radius*Math.cos(config.angle),-this.radius*Math.sin(config.angle));
		// this.point.converToDisplay();
		// this.point.point.r = 3;
		// this.point.point.style.display = 'none';

		// Create path to display the angle
		let path = this.path('');
		path.classList.add('default');
		path.addDependency(this.point);
		// path.root.style.fill = `rgb(0, 0, 255)`;
		path.root.style.fill = `#000000`;
		path.root.style.fillOpacity = '0.10';
		// path.attatchArrow( this.defs(), false);

		// path.root.style.stroke = 'none';
		path.update = () => {
			let angle = this.getAngle();
			let flag = (angle > TAU/2) ? 1 : 0;
			let r = this.radius;
			let x = r*Math.cos(angle);
			let y = -r*Math.sin(angle);
			path.d = `M ${x} ${y}
								L 0 0
								L ${r} 0
								A ${r} ${r} 0 ${flag} 0 ${x} ${y}`;
		};
		path.update();
		// this.point.constrainTo( new Circle(0,0, this.radius));
		// this.point.update();

		let arrow = this.path(`M -12 -6 L 0 0 L -12 6 L -10 0z`);
		arrow.style.fill = `#404040`;
		arrow.style.stroke = 'none';
		arrow.addDependency(this.point);
		arrow.update = () => {
			arrow.setAttribute(`transform`, `translate(${this.point.x}, ${this.point.y}) rotate(${ - this.getAngle() * 360 / TAU - 90})`);
		}
		arrow.update();


		// this.interactive.circle(0,0, this.radius + this.margin/2);

		let center = this.circle(0,0,3);
		center.style.fill = `#404040`;
		center.style.stroke = `none`;

		let text = this.text(0, this.radius + this.margin + 25, '');
		text.classList.add('katex-main', 'text-middle');
		text.tspan('θ ').classList.add('katex-variable');
		text.tspan('= ');
		let textAngle = text.tspan(`${(this.getAngle()/TAU*360).toFixed(0)}`);
		text.tspan('°');

		textAngle.addDependency(this.point);
		textAngle.update = () => {
			textAngle.root.innerHTML = `${(this.getAngle()/TAU*360).toFixed(0)}`;
		};

	}

	/**
	* Returns the current angle displayed by the interactive
	*/
	getAngle() : number {
		if( this.point.y <= 0 ) {
			return  Math.abs(Math.atan2( this.point.y, this.point.x));
		} else {
			return Math.PI*2 - Math.atan2( this.point.y, this.point.x);
		}
	}

	setAngle( value:number ) {
		this.point.x = this.radius*Math.cos(value);
		this.point.y = -this.radius*Math.sin(value);
		this.point.updateDependents();
		// this.point.translate( this.radius*Math.cos(value), -this.radius*Math.sin(value));
	}

	initializeTemplate() {

		let labelGroup = this.group();
		let group = this.group();

		let outside = this.circle(0, 0, this.radius);
		let inside = this.circle(0, 0, this.radius - 12.5);
		outside.style.stroke = `#404040`;
		outside.style.fill = 'none';
		inside.style.stroke = `#808080`;
		inside.style.fill = 'none';
		// inside.style.stroke = `#dddddd`;


		let clipPath = this.clipPath();

		// The inner and outer circles must be drawn in different rotational directions
		clipPath.appendChild( new Path((`M ${outside.cx + outside.r} ${outside.cy} A ${outside.r} ${outside.r} 0 0 0 ${outside.cx - outside.r} ${outside.cy} A ${outside.r} ${outside.r} 0 0 0 ${outside.cx + outside.r} ${outside.cy} z M ${inside.cx + inside.r} ${inside.cy} A ${inside.r} ${inside.r} 0 0 1 ${inside.cx - inside.r} ${inside.cy} A ${inside.r} ${inside.r} 0 0 1 ${inside.cx + inside.r} ${inside.cy} z` )))

		group.setAttribute('clip-path', `url(#${clipPath.id})`);

		let space = this.margin/2;
		let labels = [];
		let rects = [];
		let lightTics = group.group();
		lightTics.style.stroke = `#dddddd`;
		let mediumTics = group.group();
		mediumTics.style.stroke = `#808080`;
		let darkTics = group.group();
		darkTics.style.stroke = `#404040`;

		for( let i = 0; i <= 360; i += this.ticStep ) {
			let a = i/360*TAU;
			let x = this.radius*Math.cos(a);
			let y = -this.radius*Math.sin(a);

			// Label breakdown
			if( i % this.labelStep === 0) {
				let label = labelGroup.text( x + space*Math.cos(a), y - space*Math.sin(a), `${(a*360/TAU).toFixed(0)}°`);
				label.classList.add('katex-main', 'text-middle');

				let box = label.getBoundingBox();
				label.remove();

				let rect = labelGroup.rectangle(box.x - 3, box.y - 3, box.width + 6, box.height + 6);
				rect.style.fill= '#ffffff';
				rect.style.stroke= 'none';
				labelGroup.appendChild(label);
				labels.push(label);
				rects.push(rect);
			}

			// Color of tic marks
			if ( i % this.labelStep === 0) {
				darkTics.line(0, 0, x, y);
			} else if ( i % this.ticStepBig === 0) {
				mediumTics.line(0, 0, x, y);
			} else {
				lightTics.line(0, 0, x, y);
			}
		}
		labels[0].y -= 15;
		labels[labels.length - 1].y += 18;
		rects[0].y -= 18;
		rects[rects.length -1].y += 18;

		let r1 = 25;
		let r2 = 50;
		for( let a = 0; a < TAU; a += TAU/4 ) {
			this.line( r1*Math.cos(a), r1*Math.sin(a), r2*Math.cos(a), r2*Math.sin(a));
		}

		this.root.querySelectorAll("text").forEach( (text) => {

			let bbox = text.getBBox();
			// text.setAttribute('x',`${bbox.x}`);
			text.setAttribute('y',`${parseInt(text.getAttribute('y')) + 5}`);
			text.style.textAnchor = 'middle';
			text.classList.remove('text-middle');
		});
	}
}
