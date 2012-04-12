/*
 * Access control
 *
 * http://wiki.apache.org/couchdb/Document_Update_Validation
 *
 * Admin can do anything.
 * Documents must have title and content.
 * No documents can be changed
 *
 */

function (newDoc, oldDoc, userCtx) {
	if (userCtx.roles.indexOf('_admin') == -1) {
		throw { forbidden: "Not allowed to create or update documents" };
	}
	return true;
}
