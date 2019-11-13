/**
 * Credits to https://gist.github.com/floriankraft/f84dbf3cf5c0ece164cfdb4246eab5d4
 *
 * Modified to make it error-free and usable.
 *
 * Utility function to utilize the Promise object to handle HTML requests.
 * @param method Either "GET" or "POST", or it will be rejected; defaults to the "GET" HTTP method.
 * @param url Endpoint of request
 */
function makeHttpRequest(method, url) {
    if (method === void 0) { method = "GET"; }
    if (method != "GET" && method != "POST") {
        return null;
    }
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.onload = function () {
            if (this.status === 200) {
                resolve(this.response);
            }
            else {
                reject(new Error(this.statusText));
            }
        };
        request.onerror = function () {
            var statusMessage = this.status.toString();
            if (statusMessage.toString() == "") {
                // Error that not even the server can respond: must be network-level errors
                reject(new Error("Network-related Error"));
            }
            else {
                reject(new Error("XMLHttpRequest returns: " + statusMessage));
            }
        };
        request.open(method, url);
        request.send();
    });
}
