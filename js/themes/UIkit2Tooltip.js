// Get namespace ready
LiveValidator.themes = LiveValidator.themes || {};

LiveValidator.themes.UIkit2 = function UIkit2Theme( element, options ) {

    // Scope-safe the object
    if ( !( this instanceof LiveValidator.themes.UIkit2 ) ) {
        return new LiveValidator.themes.UIkit2( element, options );
    }

    this.element = element;
    this.options = LiveValidator.utils.extend(
        {},
        {
            danger: 'uk-form-danger',
            success: 'uk-form-success',
            parentSelector: '.uk-form-row',
            controlsSelector: '.uk-form-controls'
        },
        options
    );
    this.asterisk = null;
    this.controls = null;
    this.parentEl = LiveValidator.utils.parentSelector( this.element, this.options.parentSelector );

    if ( this.parentEl ) {
        this.asterisk = this.parentEl.querySelector( 'span.uk-text-danger' );
        this.controls = this.parentEl.querySelector( this.options.controlsSelector );
    }
};

LiveValidator.themes.UIkit2.prototype.markRequired = function() {
    if ( !this.asterisk && this.parentEl ) {
        this.asterisk = document.createElement( 'span' );
        this.asterisk.innerHTML = ' *';
        LiveValidator.utils.addClass( this.asterisk, 'uk-text-danger' );
        LiveValidator.utils.appendChild( this.parentEl.querySelector( 'label' ), this.asterisk );
    }
};
LiveValidator.themes.UIkit2.prototype.unmarkRequired = function() {
    if ( this.parentEl ) {
        LiveValidator.utils.removeChild( this.parentEl.querySelector( 'label' ), 'span' );
        this.asterisk = null;
    }
};
LiveValidator.themes.UIkit2.prototype.setMissing = function() {
    LiveValidator.utils.removeClass( this.element, this.options.success );
    LiveValidator.utils.addClass( this.element, this.options.danger );
};
LiveValidator.themes.UIkit2.prototype.unsetMissing = function() {
    LiveValidator.utils.removeClass( this.element, this.options.danger );
    LiveValidator.utils.addClass( this.element, this.options.success );
};
LiveValidator.themes.UIkit2.prototype.clearErrors = function() {
    this.unsetMissing();
    LiveValidator.utils.removeChild( this.controls, '.errors' );
};
LiveValidator.themes.UIkit2.prototype.addErrors = function( errors ) {

    // Remove old errors
    this.clearErrors();

    // Create ul
    var div = document.createElement( 'div' );
    LiveValidator.utils.addClass( div, 'errors' );
    LiveValidator.utils.addClass( div, 'uk-text-danger' );
    LiveValidator.utils.addClass( div, 'uk-margin-small-left' );

    // Add each error
    errors.forEach( function( error ) {
        var p = document.createElement( 'p' );
        LiveValidator.utils.addClass( p, 'uk-form-help-block' );
        p.innerHTML = error;
        div.appendChild( p );
    } );

    // Add errors to row
    LiveValidator.utils.appendChild( this.controls, div );
    this.setMissing();
};

/* globals UIkit */

// Get namespace ready
LiveValidator.themes = LiveValidator.themes || {};

LiveValidator.themes.UIkit2Tooltip = function UIkit2TooltipTheme( element, options ) {

    // Scope-safe the object
    if ( !( this instanceof LiveValidator.themes.UIkit2Tooltip ) ) {
        return new LiveValidator.themes.UIkit2Tooltip( element, options );
    }

    // Call parent (UIkit2) constructor
    LiveValidator.themes.UIkit2.call(
        this,
        element,
        LiveValidator.utils.extend(
            {},
            { tooltip: {
                pos: 'bottom-left',
                animation: true
            } },
            options
        )
    );

    this.tooltip = UIkit.tooltip( UIkit.$( this.element ), this.options.tooltip );
};

// Inherit methods from UIkit2
LiveValidator.themes.UIkit2Tooltip.prototype = Object.create( LiveValidator.themes.UIkit2.prototype );
LiveValidator.themes.UIkit2Tooltip.prototype.constructor = LiveValidator.themes.UIkit2Tooltip;

LiveValidator.themes.UIkit2Tooltip.prototype.clearErrors = function() {

    // Change visuals and internals as is needed
    this.unsetMissing();
    this.tooltip.element.data( 'cached-title', '' );

    // Get tooltip to manipulate it
    var $tooltip = $( '.uk-tooltip' );

    // The same hide() code from the tooltip.js file with extras removed.
    if ( this.tooltip.options.animation ) {
        $tooltip.fadeOut( parseInt( this.tooltip.options.animation, 10 ) || 400, function() {
            $tooltip.removeClass( this.tooltip.options.activeClass );
        }.bind( this ) );
    } else {
        $tooltip.hide().removeClass( this.tooltip.options.activeClass );
    }
};
LiveValidator.themes.UIkit2Tooltip.prototype.addErrors = function( errors ) {
    errors = errors.join( '<br>' );

    // Get tooltip to manipulate it
    var $tooltip = $( '.uk-tooltip' );

    // Set errors and change internals
    this.tooltip.element.data( 'cached-title', errors );
    $tooltip.find( '.uk-tooltip-inner' ).html( errors );
    this.setMissing();

    if ( !$tooltip.hasClass( this.tooltip.options.activeClass ) && this.element === document.activeElement ) {
        this.tooltip.show();
    }
};
