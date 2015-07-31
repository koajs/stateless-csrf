
# stateless-csrf

  CSRF without sessions.

## Installation

    npm install stateless-csrf

## How it works

  This CSRF protection hashes a user's unique cookie against a server-side secret.

  When the request comes in, the server hashes the cookie with the server-side
  secret and then compares it to the CSRF token. If it matches, verification is complete
  otherwise, the middleware rejects the request.

  It's a slight variation on the [double submit cookies](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Double_Submit_Cookies) using the advice
  mentioned in [this comment](http://discourse.codinghorror.com/t/preventing-csrf-and-xsrf-attacks/268/61) in [this blog post](http://blog.codinghorror.com/preventing-csrf-and-xsrf-attacks/).

## Usage

```js
var csrf = require('stateless-csrf')

app.use(csrf({
  secret: 'some server secret',
  cookie: 'name of the cookie to hash against'
}))

app.use(function * (next) {
  if ('GET' == this.method) {
    this.body = this.state.csrf
  } else if ('POST' == this.method) {
    this.body = 'protected area';
  }
})
```

## Disclaimer

  I am not a security expert nor have I done a security audit on this code.

  Use this at your own risk, and if you can think of any ways to make this more secure, let me know!

## Test

```
npm install
make test
```

## TODO

- Consider adding salt (not sure how this would help since it the user token is already unique)

## License

MIT

Copyright (c) 2015 Matthew Mueller &lt;mattmuelle@gmail.com&gt;
