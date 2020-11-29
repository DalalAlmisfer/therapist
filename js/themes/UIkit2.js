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
