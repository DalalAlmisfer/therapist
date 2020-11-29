/**
 * Try to detect checks based on some input attributes ( to 'polyfill' for browsers not supporting them )
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */

// Get namespace ready
var LiveValidator = LiveValidator || {};

LiveValidator.html5Parser = function( element ) {

    // Scope-safe the object
    if ( !( this instanceof LiveValidator.html5Parser ) ) {
        return new LiveValidator.html5Parser( element );
    }

    this.element = element;
    this.checks = [];

    // TODO: date-time input also have `min` and `max` support which is still missing
    // Types of inputs to look for in each group
    this.types = {
        numerics: [ 'number', 'range' ],
        pattern: [ 'email', 'password', 'search', 'tel', 'text', 'url' ],
        textLength: [ 'textarea', 'email', 'password', 'search', 'tel', 'text', 'url' ],
        email: [ 'email' ]
    };
};

LiveValidator.html5Parser.prototype = {
    parse: function() {
        return { checks: this.getChecks() };
    },
    /**
     * Get the checks for this input
     *
     * @return {Array} Array of checks detected with their parameters
     */
    getChecks: function() {
        var type = this.element.type;

        if ( this.types.numerics.indexOf( type ) !== -1 ) {
            this._filterNumeric();
        }

        if ( this.types.textLength.indexOf( type ) !== -1 ) {
            this._filterTextLength();
        }

        if ( this.types.pattern.indexOf( type ) !== -1 ) {
            this._filterPattern();
        }

        if ( this.types.email.indexOf( type ) !== -1 ) {
            this._filterEmail();
        }

        // Return null if no checks are found for overwrites to work correctly
        if ( this.checks.length > 0 ) {
            return this.checks;
        } else {
            return null;
        }
    },
    /**
     * Check for `min` and `max` attributes on numeric inputs
     */
    _filterNumeric: function() {
        this._addCheck( 'min' );
        this._addCheck( 'max' );
    },
    /**
     * Check for `minlength`, `maxlength` attributes on form elements
     */
    _filterTextLength: function() {
        this._addCheck( 'minlength' );
        this._addCheck( 'maxlength' );
    },
    /**
     * Check for `pattern` attribute on "text" inputs
     */
    _filterPattern: function() {
        if ( this.element.hasAttribute( 'pattern' ) ) {
            var params = {};
            params.regex = this.element.getAttribute( 'pattern' );
            params.title = this.element.getAttribute( 'title' );
            this.checks.push( { 'pattern':  params } );
        }
    },
    /**
     * Check if email has multiple on or not to contruct its check
     */
    _filterEmail: function() {
        this.checks.push( { email: this.element.multiple } );
    },
    /**
     * Try to find the 'check' attribute and add its check if it exists
     *
     * @param  {string} check The attribte to look for. Eg. `min`
     */
    _addCheck: function( check ) {
        if ( this.element.hasAttribute( check ) ) {
            var checkObj = {};
            checkObj[ check ] = parseInt( this.element.getAttribute( check ) );
            this.checks.push( checkObj );
        }
    }
};

// Register itself as an optionsParser
LiveValidator.optionsParsers.push( LiveValidator.html5Parser );

/**
 * This adds the testers for the auto checks detector
 */

LiveValidator.translations[ 'en-us' ].minNumber = 'Should be more than or equal %d';
LiveValidator.Tester.prototype.min = function( value, min ) {
    if ( this.isNumber( value ) ) {
        if ( value < min ) {
            this.addError( this.getMessage( 'minNumber' ).replace( '%d', min ) );
            return false;
        } else {
            return true;
        }
    }

    return false;
};

LiveValidator.translations[ 'en-us' ].maxNumber = 'Should be less than or equal %d';
LiveValidator.Tester.prototype.max = function( value, max ) {
    if ( this.isNumber( value ) ) {
        if ( value > max ) {
            this.addError( this.getMessage( 'maxNumber' ).replace( '%d', max ) );
            return false;
        } else {
            return true;
        }
    }
    return false;
};

LiveValidator.translations[ 'en-us' ].minlength = 'Should be %d characters or more';
LiveValidator.Tester.prototype.minlength = function( value, min ) {
    if ( value.length < min ) {
        this.addError( this.getMessage( 'minlength' ).replace( '%d', min ) );
        return false;
    } else {
        return true;
    }
};

LiveValidator.translations[ 'en-us' ].maxlength = 'Should be %d characters or less';
LiveValidator.Tester.prototype.maxlength = function( value, max ) {
    if ( value.length > max ) {
        this.addError( this.getMessage( 'maxlength' ).replace( '%d', max ) );
        return false;
    } else {
        return true;
    }
};

LiveValidator.Tester.prototype.pattern = function( value, params ) {
    var regex;

    // Try to use the 'u' flag as the docs state
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
    try {
        regex = new RegExp( params.regex, 'u' );
    } catch ( e ) {
        regex = new RegExp( params.regex );
    }

    if ( !regex.test( value ) ) {
        this.addError( params.title );
        return false;
    } else {
        return true;
    }
};

LiveValidator.translations[ 'en-us' ].beNumber = 'Value should be a number';
LiveValidator.Tester.prototype.isNumber = function( value ) {
    if ( isNaN( Number( value ) ) ) {
        this.addError( this.getMessage( 'beNumber' ) );
        return false;
    } else {
        return true;
    }
};

LiveValidator.translations[ 'en-us' ].email = 'Looking for a valid email address';
LiveValidator.Tester.prototype.email = function( value, multiple ) {
    multiple = multiple || false; // Defaults to false

    // TODO: change to validation according to RFC2822 spec
    // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript

    var regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
    var emails = [];

    if ( multiple ) {
        emails = value.split( ',' );
    } else {
        emails.push( value );
    }

    for ( var i = 0; i < emails.length; i++ ) {
        if ( !regex.test( emails[ i ] ) ) {
            this.addError( this.getMessage( 'email' ) );
            return false;
        }
    }

    return true;
};
