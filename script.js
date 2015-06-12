(function( window, document, undefined ) {

	var Line = function( lineConfig ) {
		this.current = 0;
		this.txt = lineConfig.txt;
		this.domElm = document.querySelector( lineConfig.slctr );
		this.domWrp = document.querySelector( lineConfig.slctr + '-wrapper' );
	};

	Line.prototype = {
		nextChar: function() { this.current++; },
		isAtFirstChar: function() { return this.current === 0; },
		isAtLastChar: function() { return this.current === this.txt.length - 1; },
		printToDom: function() { this.domElm.innerHTML += this.txt.charAt( this.current ); },
	};

	var createLines = function( linesToDom ) {
		var current = 0,
				lines = [];
		for( var i = 0, l = linesToDom.length; i < l; i++ ) {
			lines.push( new Line( linesToDom[i] ) );
		}

		return {
			nextLine: function() { current++; },
			current: function() { return lines[current]; },
			isNotBeyondLast: function() { return current < lines.length; },
			update: function() {
				this.current().printToDom();
				if( this.current().isAtLastChar() ) { this.nextLine(); }
				else { this.current().nextChar(); }
			}
		};
	},

	createCursor = function() {
		var timeoutFcn,
				timer = 400,
				domElm = document.querySelector( '.cursor' ),
				moveToLine = function( domWrp ) { domWrp.appendChild( domElm ); },
				addShownClass = function() { domElm.className = 'cursor shown'; },
				printToDom = function() { domElm.className = domElm.className === 'cursor shown' ? 'cursor hidden' : 'cursor shown'; },
				reset = function() {
					clearTimeout( timeoutFcn );
					addShownClass();
					nextTick();
				},
				nextTick = function() {
					timeoutFcn = setTimeout( function() {
						printToDom();
						nextTick();
					}, timer );
				};

		return {
			update: function( currentLine ) {
				reset();
				if( currentLine.isNew ) { moveToLine( currentLine.domWrp ); }
			},
			init: function() {
				nextTick();
			}
		};
	},

	createTimer = function() {
		var timer = 1500;

		return {
			delta: function() {
				return timer;
			},
			update: function( isAtLastChar ) {
				timer = isAtLastChar ? 900 : Math.floor( Math.random() * 100 ) + 10;
			}
		};
	},

	createTyper = function() {
		var timer = createTimer(),
				cursor = createCursor(),
				lines = createLines( linesToDom ),
				proceed = function() { if( lines.isNotBeyondLast() ) { nextTick(); } },
				nextTick = function() {
					setTimeout( function() {
						timer.update( lines.current().isAtLastChar() );
						cursor.update( { isNew: lines.current().isAtFirstChar(), domWrp: lines.current().domWrp } );
						lines.update();
						proceed();
					}, timer.delta() );
				};

		return {
			init: function() {
				cursor.init();
				nextTick();
			}
		};
	},

	createRndMsg = function() {
		var msgs = [ '>lol :)', '>have a nice day :)', '>have fun :)' ];
		return msgs[ Math.floor( Math.random() * ( msgs.length ) ) ];
	},

	linesToDom = [
		{ txt: 'we are keymade', slctr: '.keymade' },
		{ txt: '>we code things', slctr: '.about' },
		{ txt: '>contact@keymade.io', slctr: '.contact' },
		{ txt: createRndMsg(), slctr: '.lol' }
	],

	typer = createTyper();

	typer.init();

})( window, document );
