
/**
 * Create a new queue
 * @return {Object}
 */
module.exports = function() {
    var list = [], self = {}, running = false;

    /**
     * Add a job to the queue (will be executed if no jobs are running)
     * @param fn job function
     */
    self.exec = function(fn) {
        list.push(fn);
        if (!running) { running = true; self.next(); }
    };

    /**
     * Start executing the next job.
     */
    self.next = function() {
        if (list.length) { list.shift()(); }
        if (!list.length) { running = false; }
    };

    return self;

};
