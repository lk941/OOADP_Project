// add this file to .gitignore

module.exports = {
    google: {
        clientID: '648352656536-oimrl4ir2r8s8blv6rjq328jv0nbaaed.apps.googleusercontent.com',
        clientSecret: 'L0Bx1kZMTIK0WKGsGMHxUP0t'
    },
    facebook: {
        clientID: '2104666456500359',
        clientSecret: '6e92c97f4799e4011c071121527067b0',
        callbackURL: 'https://localhost:5000/user/facebook/callback'
    },
    twitter: {
        consumerKey: 'I8hDQQfxSJ1PzC8GPs5Jey3ov',
        consumerSecret: 'hoC2h8K8EEdcJ7ti965b8Ng9eR4SU33WKV50InWgwvk5EUvt5u',
        callbackURL: 'https://localhost:5000/user/twitter/callback'
    },
};