// Get namespace ready
LiveValidator.themes = LiveValidator.themes || {};

LiveValidator.themes.Default = function LiveValidatorTheme( element, options ) {

    // Scope-safe the object
    if ( !( this instanceof LiveValidator.themes.Default ) ) {
        return new LiveValidator.themes.Default( element, options );
    }

    this.element = element;
    this.options = LiveValidator.utils.extend(
        {},
        {
            error: 'error',
            missing: 'missing',
            parentSelector: '.row'
        },
        options
    );
    this.parentEl = LiveValidator.utils.parentSelector( this.element, this.options.parentSelector );
};

LiveValidator.themes.Default.prototype.markRequired = function() {
    LiveValidator.utils.addClass( this.parentEl, 'required' );
};
LiveValidator.themes.Default.prototype.unmarkRequired = function() {
    LiveValidator.utils.removeClass( this.parentEl, 'required' );
};
LiveValidator.themes.Default.prototype.setMissing = function() {
    LiveValidator.utils.addClass( this.parentEl, this.options.missing );
};
LiveValidator.themes.Default.prototype.unsetMissing = function() {
    LiveValidator.utils.removeClass( this.parentEl, this.options.missing );
};
LiveValidator.themes.Default.prototype.clearErrors = function() {
    LiveValidator.utils.removeClass( this.parentEl, this.options.error );
    LiveValidator.utils.removeChild( this.parentEl, 'ul' );
};
LiveValidator.themes.Default.prototype.addErrors = function( errors ) {

    // Remove old errors
    this.clearErrors();

    // Create ul
    var ul = document.createElement( 'ul' );
    LiveValidator.utils.addClass( ul, 'errors' );

    // Add each error li
    errors.forEach( function( error ) {
        var li = document.createElement( 'li' );
        li.innerHTML = error;
        ul.appendChild( li );
    } );

    // Add ul to row
    LiveValidator.utils.appendChild( this.parentEl, ul );
    LiveValidator.utils.addClass( this.parentEl, this.options.error );
};

// Set itself as the default theme
LiveValidator.defaults.theme = LiveValidator.themes.Default;
