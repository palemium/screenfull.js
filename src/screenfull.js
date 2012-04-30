/*global Element */
(function( window, document ) {
	'use strict';

	var keyboardAllowed = 'ALLOW_KEYBOARD_INPUT' in Element,
		stack = [],

		methods = (function() {
			var methodMap = [
				[
					'requestFullscreen',
					'exitFullscreen',
					'fullscreenchange',
					'fullscreen',
					'fullscreenElement'
				],
				[
					'webkitRequestFullScreen',
					'webkitCancelFullScreen',
					'webkitfullscreenchange',
					'webkitIsFullScreen',
					'webkitCurrentFullScreenElement'
				],
				[
					'mozRequestFullScreen',
					'mozCancelFullScreen',
					'mozfullscreenchange',
					'mozFullScreen',
					'mozFullScreenElement'
				]
			],
			i = 0,
			l = methodMap.length;

			for ( ; i < l; i++ ) {
				var val = methodMap[ i ];
				if ( val[1] in document ) {
					return val;
				}
			}
		})(),

		screenfull = {
			isFullscreen: document[ methods[3] ],

			element: document[ methods[4] ],

			request: function( elem, _ignore ) {
				var request = methods[0];

				elem = elem || document.documentElement;

				if ( !_ignore ) {
					stack.push( elem ); // only if no permission error
				}

				elem[ request ]( keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT );

				// Work around Safari 5.1 bug: reports support for
				// keyboard in fullscreen even though it doesn't.
				if ( !document.isFullscreen ) {
					elem[ request ]();
				}
			},

			exit: function() {
				stack.pop();
				if ( stack.length >= 1 ) {
					var elem = stack[ stack.length - 1 ];
					this.request( elem, true );
				} else {
					document[ methods[1] ]();
				}
			},

			toggle: function( elem ) {
				if ( this.isFullscreen ) {
					this.exit();
				} else {
					this.request( elem );
				}
			},

			onchange: function() {}
		};

	if ( !methods ) {
		return;
	}

	document.addEventListener( methods[2], function( e ) {
		screenfull.isFullscreen = document[ methods[3] ];
		screenfull.element = document[ methods[4] ];
		screenfull.onchange( e );
	});

	window.screenfull = screenfull;

})( window, document );