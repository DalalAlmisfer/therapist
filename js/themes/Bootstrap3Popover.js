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

// Get namespace ready
LiveValidator.themes = LiveValidator.themes || {};

LiveValidator.themes.Bootstrap3Popover = function Bootstrap3PopoverTheme( element, options ) {

    // Scope-safe the object
    if ( !( this instanceof LiveValidator.themes.Bootstrap3Popover ) ) {
        return new LiveValidator.themes.Bootstrap3Popover( element, options );
    }

    // Call parent (Bootstrap3) constructor
    LiveValidator.themes.Bootstrap3.call(
        this,
        element,
        LiveValidator.utils.extend(
            {},
            { popover: {
                html: true,
                placement: 'bottom',
                trigger: 'focus',
                title: 'Keep these in mind'
            } },
            options
        )
    );

    this.errors = null;
    $( this.element ).popover( this.options.popover );
    this.popover = $( this.element ).data( 'bs.popover' );

    // Prevent popover from being displayed when there are no errors - title triggers this to happen
    this.options.popover.trigger.split( ' ' ).forEach( function( event ) {

        // Change hover event to mouseenter if needed
        event = event === 'hover' ? 'mouseenter' : event;
        this.element.addEventListener( event, function() {
            if ( !this.errors ) {
                this.popover.hide();
            }
        }.bind( this ) );
    }.bind( this ) );
};

// Inherit methods from Bootstrap3
LiveValidator.themes.Bootstrap3Popover.prototype = Object.create( LiveValidator.themes.Bootstrap3.prototype );
LiveValidator.themes.Bootstrap3Popover.prototype.constructor = LiveValidator.themes.Bootstrap3Popover;

LiveValidator.themes.Bootstrap3Popover.prototype.clearErrors = function() {
    LiveValidator.utils.removeClass( this.parentEl, this.options.error );
    this.element.dataset.content = '';
    this.errors = null;
    this.popover.hide();
};
LiveValidator.themes.Bootstrap3Popover.prototype.addErrors = function( errors ) {

    // Create this.errors for popover
    this.errors = errors.join( '<br>' );

    // Set content and show popover
    this.element.dataset.content = this.errors;
    this.popover.tip().find( '.popover-content' ).html( this.errors );
    LiveValidator.utils.addClass( this.parentEl, this.options.error );

    // Only show popover if element has focus and popover not shown
    if ( this.parentEl && this.element === document.activeElement && !this.parentEl.querySelector( '.popover' ) ) {
        this.popover.show();
    }
};
