/**
 * Module Dependencies
 */

var assign = require('object-assign')
var assert = require('assert')
var hasha = require('hasha')

/**
 * Export `csrf`
 */

module.exports = csrf

/**
 * Ignore
 */

var ignore = {
  'HEAD': true,
  'OPTIONS': true
}

/**
 * Initialize `csrf`
 *
 * @param {Object} options
 * @return {Generator}
 */

function csrf (options) {
  options = options || {}

  assert(options.secret, 'you must pass a server-side secret to use in the encryption')
  assert(options.cookie, 'you must pass the key of the cookie to generate the token and verify authenticity')

  return function *_csrf (next) {
    if (ignore[this.method]) return yield next

    // set the default based on if the keygrip is set or not.
    options.sign = options.sign === undefined
      ? this.app.keys && this.app.keys.length
      : !!options.sign

    // generate a CSRF token
    return 'GET' == this.method
      ? yield* create.call(this, options, next)
      : yield* verify.call(this, options, next)
  }
}

/**
 * Generate a CSRF token
 *
 * @param {Object} options
 * @param {Generator} next
 */

function *create (options, next) {
  var token = this.cookies.get('token', { signed: options.sign })
  if (!token) return yield next
  var csrf = hasha(options.secret + '.' + token)
  this.state = assign(this.state || {}, {
    csrf: csrf
  })
  yield next
}

/**
 * Validate a CSRF token
 *
 * @param {Object} options
 * @param {Generator} next
 */

function *verify (options, next) {
  // Get the token
  var token = this.cookies.get(options.cookie, { signed: options.sign })
  if (!token) return this.throw(403, 'failed csrf check, no cookie value found')

  // get the CSRF token
  var csrf = get_csrf(this)
  if (!csrf) return this.throw(403, 'failed csrf check, no csrf token present')

  var hash = hasha(options.secret + '.' + token)

  // verify CSRF token passed in matches the hash
  if (hash == csrf) {
    yield next
  } else {
    this.throw(403, 'invalid csrf token')
  }
}

/**
 * Get the CSRF token
 *
 * @param {Application} ctx
 * @return {String|Boolean}
 */

function get_csrf(ctx) {
  var body = ctx.request.body
  return (body && body._csrf)
    || (ctx.query && ctx.query._csrf)
    || (ctx.get('x-csrf-token'))
    || (ctx.get('x-xsrf-token'))
    || ('string' == typeof body && body)
}
