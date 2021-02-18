var numberOfInstruments = 5;

mixer = new Mixer(numberOfInstruments);

var ignoreMouseDown = false;

function fadeOutLoadingScreen () {
	document.getElementById("loading").classList.add("fade-out");;
}

window.moduleDidLoad = function () {
	initialiseMixer();
	fadeOutLoadingScreen();
}

// Ported from original Metaball script by SATO Hiroyuki
// http://park12.wakwak.com/~shp/lc/et/en_aics_script.html
project.currentStyle = {
	fillColor: 'black'
};

var ballPositions = [[455, 229], [810, 173], [686, 463],
	[217, 559], [154, 200], [847, 534]];

var handle_len_rate = 2.4;
var effectCircles = new Group();

var effectsParamsArray = ["cf", "reverb", "resonatorFreq", "feedbackRatio",
		"decimatorBitDepth", "harmonyEstimFreq"];
var effectsNameArray = ["cutoff", "reverb", "resonator", "feedback",
		"decimator", "harmony"];

var radius = 50;
for (var i = 0; i < effectsParamsArray.length; i++) {
	var effectCircle = new Shape.Circle({
		center: ballPositions[i],
		radius: 50,
		fillColor: "maroon"
	});
	effectCircle.data.effectParam = effectsParamsArray[i];
	effectCircle.data.effectName = effectsNameArray[i];
	effectCircle.onMouseDown = function () {
		if (selectedCircle == this) {
			DeselectCircle();
		} else {
			SelectCircle(this);
		}
	};
	effectCircles.addChild(effectCircle);
}

var instrumentCircles = new Group();

var selectedCircle;

var instrumentColors = ["yellow", "red", "green", "purple", "magenta"];

for (i=0; i<numberOfInstruments; i++) {
	var currentCircle = new Shape.Circle({
		center: [1200, 170 + i*100],
 		radius: 10,
		fillColor: instrumentColors[i],
		//strokeColor: "black"
		//strokeWidth: 2,
		blendMode: "hue"
	});

	currentCircle.data.instrumentNumber = i+1;
	//currentCircle.fillColor.hue *= i;
	currentCircle.onMouseDown = function (event) {
		if (selectedCircle == this) {
			DeselectCircle();
		} else {
			SelectCircle(this);
		}
	};

	instrumentCircles.addChild(currentCircle);
}

function onMouseMove(event) {
	if (selectedCircle) {
		selectedCircle.data.origin = event.point;
	}
}

function onMouseDown(event) {
	mixer.Play();
	if (!ignoreMouseDown)
	{
		DeselectCircle();
	}
	ignoreMouseDown = false;
}

var connections = new Group();

var maxConnectionDistance = 300;

function generateConnections() {
	// Remove the last connection paths:
	connections.removeChildren();

	for (var effectNo = 0; effectNo < effectCircles.children.length; effectNo++) {
		for (var trackNo = 0; trackNo < instrumentCircles.children.length; trackNo++) {
			var currentEffectCircle = effectCircles.children[effectNo];
			var currentTrackCircle = instrumentCircles.children[trackNo];
			var path = metaball(currentEffectCircle, currentTrackCircle, 0.5, handle_len_rate, maxConnectionDistance);
			if (path) {
				connections.appendTop(path);
			}

			var center1 = currentEffectCircle.position;
			var center2 = currentTrackCircle.position;
			var distance = center1.getDistance(center2);

			if (distance < maxConnectionDistance) {
				mixer.tracks[trackNo].effects[effectNo].SetEnabled(true);
				mixer.tracks[trackNo].effects[effectNo].RemapAndSetParam(distance, maxConnectionDistance, 0);
			}
			else {
				mixer.tracks[trackNo].effects[effectNo].SetEnabled(false);
			}
		}
	}
}

function SelectCircle(circleToSelect) {
	selectedCircle = circleToSelect;
	selectedCircle.strokeColor = 'white';
	selectedCircle.strokeWidth = 3;
	ignoreMouseDown = true;
}

function DeselectCircle() {
	selectedCircle.strokeWidth = 0;
	selectedCircle = null;
}

// ---------------------------------------------
function metaball(ball1, ball2, v, handle_len_rate, maxDistance) {
	var center1 = ball1.position;
	var center2 = ball2.position;
	var radius1 = ball1.bounds.width / 2;
	var radius2 = ball2.bounds.width / 2;
	var pi2 = Math.PI / 2;
	var d = center1.getDistance(center2);
	var u1, u2;

	if (radius1 == 0 || radius2 == 0)
		return;

	if (d > maxDistance || d <= Math.abs(radius1 - radius2)) {
		return;
	} else if (d < radius1 + radius2) { // case circles are overlapping
		u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) /
				(2 * radius1 * d));
		u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) /
				(2 * radius2 * d));
	} else {
		u1 = 0;
		u2 = 0;
	}

	var angle1 = (center2 - center1).getAngleInRadians();
	var angle2 = Math.acos((radius1 - radius2) / d);
	var angle1a = angle1 + u1 + (angle2 - u1) * v;
	var angle1b = angle1 - u1 - (angle2 - u1) * v;
	var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
	var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
	var p1a = center1 + getVector(angle1a, radius1);
	var p1b = center1 + getVector(angle1b, radius1);
	var p2a = center2 + getVector(angle2a, radius2);
	var p2b = center2 + getVector(angle2b, radius2);

	// define handle length by the distance between
	// both ends of the curve to draw
	var totalRadius = (radius1 + radius2);
	var d2 = Math.min(v * handle_len_rate, (p1a - p2a).length / totalRadius);

	// case circles are overlapping:
	d2 *= Math.min(1, d * 2 / (radius1 + radius2));

	radius1 *= d2;
	radius2 *= d2;

	var path = new Path({
		segments: [p1a, p2a, p2b, p1b],
		style: ball1.style,
		closed: true
	});
	var segments = path.segments;
	segments[0].handleOut = getVector(angle1a - pi2, radius1);
	segments[1].handleIn = getVector(angle2a + pi2, radius2);
	segments[2].handleOut = getVector(angle2b - pi2, radius2);
	segments[3].handleIn = getVector(angle1b + pi2, radius1);
	return path;
}

// ------------------------------------------------
function getVector(radians, length) {
	return new Point({
		// Convert radians to degrees:
		angle: radians * 180 / Math.PI,
		length: length
	});
}

document.getElementById("canvas").addEventListener('wheel', function (event) {
	if (selectedCircle && selectedCircle.isDescendant(instrumentCircles)) {
		var scale = event.deltaY * -0.1;
		console.log(scale);
		console.log(selectedCircle);
		var newRadius = selectedCircle.radius + scale;
		console.log(newRadius);
		newRadius = Math.min(Math.max(newRadius, 10), 100);
		selectedCircle.radius = newRadius;
		csound.SetChannel("amp" + selectedCircle.data.instrumentNumber, newRadius/100);
	}
});

var movementDistance = 50;

function moveCircle(circle, elapsedTime) {
	if (!circle.data.origin){
		return;
	}
	if (!circle.data.timeOffset)
	{
		circle.data.timeOffset = elapsedTime;
	}
	if (circle.data.direction == null)
	{
		circle.data.direction = 1;
	}
	if (!circle.data.distanceX) {
		circle.data.distanceX = movementDistance;
	}
	if (!circle.data.distanceY) {
		circle.data.distanceY = movementDistance;
	}
	if (!circle.data.speed) {
		circle.data.speed = 1;
	}

	if (circle.data.moveHorizontally) {
		var sineDelta = Math.sin(elapsedTime*circle.data.speed - circle.data.timeOffset) * circle.data.direction;
		circle.position.x = circle.data.origin.x + (sineDelta * circle.data.distanceX);
	} else {
		circle.position.x = circle.data.origin.x;
	}
	if (circle.data.moveVertically) {
		var cosDelta = Math.cos(elapsedTime*circle.data.speed - circle.data.timeOffset);
		circle.position.y = circle.data.origin.y + (cosDelta * circle.data.distanceY);
	} else {
		circle.position.y = circle.data.origin.y;
	}
}

function onFrame (event) {

	instrumentCircles.children.forEach(function (instrumentCircle) {
		moveCircle(instrumentCircle, event.time);
	});

	effectCircles.children.forEach(function (instrumentCircle) {
		moveCircle(instrumentCircle, event.time);
	});

	generateConnections();
}

function onKeyDown(event) {
	if (event.key == 'space') {
		document.getElementById('legend').classList.toggle('hidden');
		document.getElementById('console').classList.toggle('hidden');
	}

	if (selectedCircle) {
		if (event.key == 'v') {
			console.log("toggle vertical");
			selectedCircle.data.moveVertically = !selectedCircle.data.moveVertically;
		}
		if (event.key == 'h') {
			console.log("toggle horizontal");
			selectedCircle.data.moveHorizontally = !selectedCircle.data.moveHorizontally;
		}
		if (event.key == 'r') {
			console.log("reset rotation");
			selectedCircle.data.timeOffset = event.time;
		}
		if (event.key == 'd') {
			console.log("change direction");
			selectedCircle.data.direction = selectedCircle.data.direction * -1;
		}
		if (event.key == "up") {
			console.log("increase y distance");
			selectedCircle.data.distanceY += 5;
			if (selectedCircle.data.distanceY > 1000) {
				selectedCircle.data.distanceY = 1000;
			}
		}
		if (event.key == "down") {
			console.log("decrease y distance");
			selectedCircle.data.distanceY -= 5;
			if (selectedCircle.data.distanceY < 5) {
				selectedCircle.data.distanceY = 5;
			}
		}
		if (event.key == "right") {
			console.log("increase x distance");
			selectedCircle.data.distanceX += 5;
			if (selectedCircle.data.distanceX > 1000) {
				selectedCircle.data.distanceX = 1000;
			}
		}
		if (event.key == "left") {
			console.log("decrease x distance");
			selectedCircle.data.distanceX -= 5;
			if (selectedCircle.data.distanceX < 5) {
				selectedCircle.data.distanceX = 5;
			}
		}
		if (event.key == "f") {
			console.log("increase speed");
			selectedCircle.data.speed += 0.2;
			if (selectedCircle.data.speed > 5) {
				selectedCircle.data.speed = 5;
			}
		}
		if (event.key == "s") {
			console.log("decrease speed");
			selectedCircle.data.speed -= 0.2;
			if (selectedCircle.data.speed < 0.2) {
				selectedCircle.data.speed = 0.2;
			}
		}
	}
}
