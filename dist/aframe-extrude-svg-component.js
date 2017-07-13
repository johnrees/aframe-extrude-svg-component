/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	// const shapeFromPathString = require('./lib/shape_from_path_string');
	const transformSVGPath = __webpack_require__ (1)

	const extrudeShape = function(shape, data) {
	  return new THREE.ExtrudeGeometry(
	    shape,
	    {
	      amount: data.amount,
	      steps: data.steps,
	      bevelEnabled: data.bevelEnabled
	    }
	  );
	}

	/**
	 * Extrude SVG component for A-Frame.
	 */
	AFRAME.registerComponent('extrude-svg', {
	  schema: {
	    path: {type: 'string', default: 'm 1 1 l -2 0 l 0 -2 l 2 0 l 0 2'},
	    amount: {type: 'number', default: 1}, // Depth to extrude the shape
	    bevelEnabled: {type: 'boolean', default: false}, // Apply beveling to the shape
	    bevelThickness: {type: 'number', default: 0.06}, // How deep into the original shape the bevel goes
	    bevelSize: {type: 'number', default: 0.04 }, // Distance from the shape outline that the bevel extends. Default is bevelThickness - 0.02
	    bevelSegments: {type: 'number', default: 3 }, // Number of bevel layers
	    curveSegments: { type: 'boolean', default: 12 }, // Number of points on the curves
	    steps: { type: 'number', default: 1 }, // Number of points used for subdividing segments along the depth of the extruded spline
	  },

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: false,

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function () {
	    const data = this.data;
	    const el = this.el;

	    this.shape = transformSVGPath(data.path);
	    this.geometry = extrudeShape(this.shape, data);

	    this.mesh = new THREE.Mesh(this.geometry, this.material);
	    el.setObject3D('mesh', this.mesh);
	  },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	  update: function (oldData) {
	    // If `oldData` is empty, then this means we're in the initialization process.
	    // No need to update.
	    if (Object.keys(oldData).length === 0) { return; }
	    const data = this.data;
	    const el = this.el;
	    // Geometry-related properties changed. Update the geometry.
	    if (data.path !== oldData.path) {
	      this.shape = transformSVGPath(data.path);
	    }
	    if (
	      data.amount !== oldData.amount ||
	      data.steps !== oldData.steps ||
	      data.bevelEnabled !== oldData.bevelEnabled
	    ) {
	      el.getObject3D('mesh').geometry = this.geometry = extrudeShape(this.shape)
	    }
	  },

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	  remove: function () {
	    this.el.removeObject3D('mesh');
	  },

	  /**
	   * Called on each scene tick.
	   */
	  // tick: function (t) { },

	  /**
	   * Called when entity pauses.
	   * Use to stop or remove any dynamic or background behavior such as events.
	   */
	  pause: function () { },

	  /**
	   * Called when entity resumes.
	   * Use to continue or add any dynamic or background behavior such as events.
	   */
	  play: function () { }
	});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	// from https://gist.github.com/IkarosKappler/d3c39db08115085bcb18

	const transformSVGPath = function(pathStr) {

	  const DIGIT_0 = 48, DIGIT_9 = 57, COMMA = 44, SPACE = 32, PERIOD = 46,
	      MINUS = 45;
	    const DEGS_TO_RADS = Math.PI/180.0;

	  var path = new THREE.Shape();

	  var idx = 1, len = pathStr.length, activeCmd,
	      x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
	      x1 = 0, x2 = 0, y1 = 0, y2 = 0,
	      rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;

	  function eatNum() {
	    var sidx, c, isFloat = false, s;
	    // eat delims
	    while (idx < len) {
	      c = pathStr.charCodeAt(idx);
	      if (c !== COMMA && c !== SPACE)
	        break;
	      idx++;
	    }
	    if (c === MINUS)
	      sidx = idx++;
	    else
	      sidx = idx;
	    // eat number
	    while (idx < len) {
	      c = pathStr.charCodeAt(idx);
	      if (DIGIT_0 <= c && c <= DIGIT_9) {
	        idx++;
	        continue;
	      }
	      else if (c === PERIOD) {
	        idx++;
	        isFloat = true;
	        continue;
	      }

	      s = pathStr.substring(sidx, idx);
	      return isFloat ? parseFloat(s) : parseInt(s);
	    }

	    s = pathStr.substring(sidx);
	    return isFloat ? parseFloat(s) : parseInt(s);
	  }

	  function nextIsNum() {
	    var c;
	    // do permanently eat any delims...
	    while (idx < len) {
	      c = pathStr.charCodeAt(idx);
	      if (c !== COMMA && c !== SPACE)
	        break;
	      idx++;
	    }
	    c = pathStr.charCodeAt(idx);
	    return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
	  }

	    function eatAbsoluteArc() {
	  rx = eatNum();
	        ry = eatNum();
	        xar = eatNum() * DEGS_TO_RADS;
	        laf = eatNum();
	        sf = eatNum();
	        nx = eatNum();
	        ny = eatNum();

	  if( activeCmd == 'a' ) { // relative
	      nx += x;
	      ny += y;
	  }

	  console.debug( "[SVGPath2ThreeShape.eatAbsoluteArc] Read arc params: rx=" + rx + ", ry=" + ry + ", xar=" + xar + ", laf=" + laf + ", sf=" + sf + ", nx=" + nx + ", ny=" + ny );
	        if (rx !== ry) {
	          console.warn("Forcing elliptical arc to be a circular one :(",
	                       rx, ry);
	        }
	        // SVG implementation notes does all the math for us! woo!
	        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
	        // step1, using x1 as x1'
	        x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
	        y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
	        // step 2, using x2 as cx'
	  console.debug( "[SVGPath2ThreeShape.eatAbsoluteArc] TMP x1=" + x1 + ", y1=" + y1 + ", (rx*rx * y1*y1 + ry*ry * x1*x1)=" + (rx*rx * y1*y1 + ry*ry * x1*x1) + ", (rx*rx * ry*ry - rx*rx * y1*y1 - ry*ry * x1*x1)=" + (rx*rx * ry*ry - rx*rx * y1*y1 - ry*ry * x1*x1) );
	        var norm = Math.sqrt( Math.abs(
	          (rx*rx * ry*ry - rx*rx * y1*y1 - ry*ry * x1*x1) /
	          (rx*rx * y1*y1 + ry*ry * x1*x1) ) );
	        if (laf === sf)
	          norm = -norm;
	        x2 = norm * rx * y1 / ry;
	        y2 = norm * -ry * x1 / rx;
	  console.debug( "[SVGPath2ThreeShape.eatAbsoluteArc] TMP norm=" + norm + ", x2=" + x2 + ", y2=" + y2 );
	        // step 3
	        cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
	        cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;
	  console.debug( "[SVGPath2ThreeShape.eatAbsoluteArc] TMP cx=" + cx + ", cy=" + cy );

	        var u = new THREE.Vector2(1, 0),
	            v = new THREE.Vector2((x1 - x2) / rx,
	                                  (y1 - y2) / ry);
	        var startAng = Math.acos(u.dot(v) / u.length() / v.length());
	        if (u.x * v.y - u.y * v.x < 0)
	          startAng = -startAng;

	        // we can reuse 'v' from start angle as our 'u' for delta angle
	        u.x = (-x1 - x2) / rx;
	        u.y = (-y1 - y2) / ry;

	        var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
	        // This normalization ends up making our curves fail to triangulate...
	        if (v.x * u.y - v.y * u.x < 0)
	          deltaAng = -deltaAng;
	        if (!sf && deltaAng > 0)
	          deltaAng -= Math.PI * 2;
	        if (sf && deltaAng < 0)
	          deltaAng += Math.PI * 2;

	  console.debug( "[SVGPath2ThreeShape.eatAbsoluteArc] Building arc from values: cx=" + cx + ", cy=" + cy + ", startAng=" + startAng + ", deltaAng=" + deltaAng + ", endAng=" + (startAng+deltaAng) + ", sweepFlag=" + sf );
	        path.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
	        x = nx;
	        y = ny;
	    }

	  var canRepeat;
	  activeCmd = pathStr[0];
	  while (idx <= len) {
	    canRepeat = true;
	    switch (activeCmd) {
	        // moveto commands, become lineto's if repeated
	      case 'M':
	        x = eatNum();
	        y = eatNum();
	        path.moveTo(x, y);
	        activeCmd = 'L';
	        break;
	      case 'm':
	        x += eatNum();
	        y += eatNum();
	        path.moveTo(x, y);
	        activeCmd = 'l';
	        break;
	      case 'Z':
	      case 'z':
	        canRepeat = false;
	        if (x !== firstX || y !== firstY)
	          path.lineTo(firstX, firstY);
	        break;
	        // - lines!
	      case 'L':
	      case 'H':
	      case 'V':
	        nx = (activeCmd === 'V') ? x : eatNum();
	        ny = (activeCmd === 'H') ? y : eatNum();
	        path.lineTo(nx, ny);
	        x = nx;
	        y = ny;
	        break;
	      case 'l':
	      case 'h':
	      case 'v':
	        nx = (activeCmd === 'v') ? x : (x + eatNum());
	        ny = (activeCmd === 'h') ? y : (y + eatNum());
	        path.lineTo(nx, ny);
	        x = nx;
	        y = ny;
	        break;
	        // - cubic bezier
	      case 'C':
	        x1 = eatNum(); y1 = eatNum();
	      case 'S':
	        if (activeCmd === 'S') {
	          x1 = 2 * x - x2; y1 = 2 * y - y2;
	        }
	        x2 = eatNum();
	        y2 = eatNum();
	        nx = eatNum();
	        ny = eatNum();
	        path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
	        x = nx; y = ny;
	        break;
	      case 'c':
	        x1 = x + eatNum();
	        y1 = y + eatNum();
	      case 's':
	        if (activeCmd === 's') {
	          x1 = 2 * x - x2;
	          y1 = 2 * y - y2;
	        }
	        x2 = x + eatNum();
	        y2 = y + eatNum();
	        nx = x + eatNum();
	        ny = y + eatNum();
	        path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
	        x = nx; y = ny;
	        break;
	        // - quadratic bezier
	      case 'Q':
	        x1 = eatNum(); y1 = eatNum();
	      case 'T':
	        if (activeCmd === 'T') {
	          x1 = 2 * x - x1;
	          y1 = 2 * y - y1;
	        }
	        nx = eatNum();
	        ny = eatNum();
	        path.quadraticCurveTo(x1, y1, nx, ny);
	        x = nx;
	        y = ny;
	        break;
	      case 'q':
	        x1 = x + eatNum();
	        y1 = y + eatNum();
	      case 't':
	        if (activeCmd === 't') {
	          x1 = 2 * x - x1;
	          y1 = 2 * y - y1;
	        }
	        nx = x + eatNum();
	        ny = y + eatNum();
	        path.quadraticCurveTo(x1, y1, nx, ny);
	        x = nx; y = ny;
	        break;
	        // - elliptical arc
	    case 'A':
	  // eatAbsoluteArc();
	      case 'a':
	  eatAbsoluteArc();
	        break;
	      default:
	        throw new Error("weird path command: " + activeCmd);
	    }
	    if (firstX === null) {
	      firstX = x;
	      firstY = y;
	    }
	    // just reissue the command
	    if (canRepeat && nextIsNum())
	      continue;
	    activeCmd = pathStr[idx++];
	  }

	  return path;
	}

	module.exports = transformSVGPath;


/***/ })
/******/ ]);