/**
 * Created with IntelliJ IDEA.
 * User: spion
 * Date: 5/12/12
 * Time: 6:34 PM
 * To change this template use File | Settings | File Templates.
 */

var get103history = function(cb) {
    $.getJSON('http://prisutni.spodeli.org/status/103?callback=?', cb);
}
