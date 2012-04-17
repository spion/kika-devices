
/**
 * Create a new queue
 * @return {Object}
 */
module.exports = function() {
    var list = [], self = {};

    /**
     * Add a job to the queue (will be executed if no jobs are running)
     * @param fn job function
     */
    self.exec = function(fn) {
        list.push(fn);
        if (list.length == 1) self.next();
    };

    /**
     * Start executing the next job.
     */
    self.next = function() {
        if (list.length) list.shift()();
    };

    return self;

};
