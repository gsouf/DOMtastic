describe('events', function() {

    var spy;

    beforeEach(function() {
        spy = jasmine.createSpy();
    });

    it('should attach an event handler to an element', function() {
        var element = getElement(document.body);
        element.on('click', spy);
        element.trigger('click');
        expect(spy).toHaveBeenCalled();
    });

    it('should attach event handlers to multiple elements', function() {
        var elements = $('#testFragment li');
        elements.on('click', spy);
        elements.trigger('click');
        expect(spy.calls.count()).toBe(5);
    });

    it('should attach an event handler of any type to an element', function() {
        var element = getElement(document.body);
        element.on('foo', spy);
        element.trigger('foo');
        expect(spy).toHaveBeenCalled();
    });

    it('should receive events bubbling up to an element', function() {
        var element = getElement(document.body);
        element.on('EVENT-bubbling', spy);
        $('.two').trigger('EVENT-bubbling');
        expect(spy).toHaveBeenCalled();
    });

    // Test disabled, since this feature is available in IE and Firefox, but not in WebKit-based browsers
    xit('should receive events bubbling up to an element not in the DOM', function() {
        var element = $('<div><p></p></div>');
        element.on('EVENT-unattached-element', spy);
        element.$('p').trigger('EVENT-unattached-element');
        expect(spy).toHaveBeenCalled();
    });

    it('should not receive events bubbling up to an element when `bubbles` is set to false', function() {
        var element = getElement(document.body);
        element.on('EVENT-non-bubbling', spy);
        $('.two').trigger('EVENT-non-bubbling', {bubbles: false});
        expect(spy).not.toHaveBeenCalled();
    });

    it('should detach an event handler from an element', function() {
        var element = getElement(document.body);
        element.on('EVENT-detach', spy);
        element.off('EVENT-detach', spy);
        element.trigger('EVENT-detach');
        expect(spy).not.toHaveBeenCalled();
    });

    it('should detach event handlers from multiple elements', function() {
        var elements = $('#testFragment li');
        elements.on('EVENT-detach-multi', spy);
        elements.off('EVENT-detach-multi', spy);
        elements.trigger('EVENT-detach-multi');
        expect(spy).not.toHaveBeenCalled();
    });

    it('should receive a delegated event from a child element', function() {
        var element = getElement(document.body);
        element.delegate('li', 'EVENT-delegated', spy);
        $('.fourth').trigger('EVENT-delegated');
        expect(spy).toHaveBeenCalled();
    });

    it('should receive delegated events from multiple child elements', function() {
        var elements = $('#testFragment li');
        elements.delegate('span', 'EVENT-delegated-multi', spy);
        $('#testFragment li span').trigger('EVENT-delegated-multi');
        expect(spy.calls.count()).toBe(5);
    });

    it('should detach a delegated event handler from an element', function() {
        var element = getElement(document.body);
        element.delegate('li', 'EVENT-delegated-detach', spy);
        element.undelegate('li', 'EVENT-delegated-detach', spy);
        $('.fourth').trigger('testEvent2');
        expect(spy).not.toHaveBeenCalled();
    });

    it('should detach a delegated event handler from multiple elements', function() {
        var elements = $('#testFragment li');
        elements.delegate('li', 'EVENT-delegated-detach-multi', spy);
        elements.undelegate('li', 'EVENT-delegated-detach-multi', spy);
        $('.fourth').trigger('testEvent21');
        expect(spy).not.toHaveBeenCalled();
    });

    it('should forward request to `delegate` if that signature was used', function() {
        var element = getElement(document.body);
        element.on('li', 'EVENT-on-delegate', spy);
        $('.fourth').trigger('EVENT-on-delegate');
        expect(spy).toHaveBeenCalled();
    });

    it('should forward request to `undelegate` if that signature was used', function() {
        var element = getElement(document.body);
        element.on('li', 'EVENT-off-undelegate', spy);
        element.off('li', 'EVENT-off-undelegate', spy);
        $('.fourth').trigger('EVENT-on-delegate');
        expect(spy).not.toHaveBeenCalled();
    });

    it('should have the correct `event.target` and `event.currentTarget`', function() {
        var element = $('.fourth'), eventTarget, eventCurrentTarget;
        getElement(document.body).delegate('li', 'EVENT-target-currentTarget', function(event) {
            eventTarget = event.target;
            eventCurrentTarget = event.currentTarget;
        });
        element.trigger('EVENT-target-currentTarget');
        expect(eventTarget).toBe(element[0]);
        expect(eventCurrentTarget).toBe(document.body);
    });

    it('should receive delegated events from child elements', function() {
        var element = getElement(document.body);
        element.delegate('li', 'EVENT-delegated-children', spy);
        $('.two').trigger('EVENT-delegated-children');
        $('.three').trigger('EVENT-delegated-children');
        $('.fourth').trigger('EVENT-delegated-children');
        expect(spy.calls.count()).toBe(3);
    });

    it('should remove all delegated handlers when un-delegating event handlers', function() {
        var element = getElement(document.body);
        element.delegate('li', 'EVENT-undelegate', spy);
        element.delegate('li', 'EVENT-undelegate', spy);
        element.delegate('li', 'EVENT-undelegate', spy);
        element.undelegate('li', 'EVENT-undelegate', spy);
        $('.two').trigger('EVENT-undelegate');
        expect(spy.calls.count()).toBe(0);
    });

    it('should provide a chainable API', function() {
        getElement(document.body).on('EVENT-chainable', spy).off('EVENT-chainable', spy).delegate('.two', 'EVENT-chainable', spy).undelegate('.two', 'EVENT-chainable', spy);
        $('.two').trigger('EVENT-chainable');
        expect(spy.calls.count()).toBe(0);
    });

});
