// Get namespace ready
LiveValidator.themes = LiveValidator.themes || {};

LiveValidator.themes.Bootstrap3 = function Bootstrap3Theme( element, options ) {

    // Scope-safe the object
    if ( !( this instanceof LiveValidator.themes.Bootstrap3 ) ) {
        return new LiveValidator.themes.Bootstrap3( element, options );
    }

    this.element = element;
    this.options = LiveValidator.utils.extend(
        {},
        {
            error: 'has-warning',
            missing: 'has-error',
            parentSelector: '.form-group'
        },
        options
    );
    this.asterisk = null;
    this.parentEl = LiveValidator.utils.parentSelector( this.element, this.options.parentSelector );

    if ( this.parentEl ) {
        this.asterisk = this.parentEl.querySelector( 'span.text-danger' );
    }
};

LiveValidator.themes.Bootstrap3.prototype.markRequired = function() {
    if ( !this.asterisk && this.parentEl ) {
        this.asterisk = document.createElement( 'span' );
        this.asterisk.innerHTML = ' *';
        LiveValidator.utils.addClass( this.asterisk, 'text-danger' );
        LiveValidator.utils.appendChild( this.parentEl.querySelector( 'label' ), this.asterisk );
    }
};
LiveValidator.themes.Bootstrap3.prototype.unmarkRequired = function() {
    if ( this.parentEl ) {
        LiveValidator.utils.removeChild( this.parentEl.querySelector( 'label' ), 'span' );
        this.asterisk = null;
    }
};
LiveValidator.themes.Bootstrap3.prototype.setMissing = function() {
    LiveValidator.utils.addClass( this.parentEl, this.options.missing );
};
LiveValidator.themes.Bootstrap3.prototype.unsetMissing = function() {
    LiveValidator.utils.removeClass( this.parentEl, this.options.missing );
};
LiveValidator.themes.Bootstrap3.prototype.clearErrors = function() {
    LiveValidator.utils.removeClass( this.parentEl, this.options.error );
    LiveValidator.utils.removeChild( this.parentEl, '.errors' );
};
LiveValidator.themes.Bootstrap3.prototype.addErrors = function( errors ) {

    // Remove old errors
    this.clearErrors();

    // Create div
    var holder = document.createElement( 'div' );
    LiveValidator.utils.addClass( holder, 'errors' );

    // Add each error span
    errors.forEach( function( error ) {
        var span = document.createElement( 'span' );
        span.innerHTML = error;
        LiveValidator.utils.addClass( span, 'help-block' );
        holder.appendChild( span );
    } );

    // Add holder to row
    LiveValidator.utils.appendChild( this.parentEl, holder );
    LiveValidator.utils.addClass( this.parentEl, this.options.error );
};
