//create token and saving in cookies
const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const isProduction = process.env.NODE_ENV === "production";

    //options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true, //JavaScript in the browser should not access this cookie.
        sameSite: isProduction ? "none" : "lax", // none: Cookie is sent on cross-site requests. Requires secure: true (HTTPS). lax: Sent during normal navigation, but not cross-site API calls. Default in most browsers
        secure: isProduction,
        //It means: "In production, require HTTPS for this cookie. In development, don't require HTTPS."
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    })
}

module.exports = sendToken;

/*

90 days

× 24 hours

× 60 minutes

× 60 seconds

× 1000 milliseconds

So: Date.now() + 90 days
means: Current time + 90 days

The cookie expires after 90 days.

----------------------------------------------------------
                   httpOnly
----------------------------------------------------------
This tells the browser:

"JavaScript running in the browser should not be allowed to directly access this cookie.

Without httpOnly:

document.cookie
could show: token=abc123
A malicious script could steal it.

With:

httpOnly:true
Browser stores it, but: document.cookie
cannot read it.
Only the server can access it.

----------------------------------------------------------
                   Cookie syntax
----------------------------------------------------------

Syntax:

res.cookie(
    cookieName,
    cookieValue,
    options
)
*/

/*
Why does this setting exist at all?

Browsers have a security rule about cookies: should a cookie be sent when the request comes from a different website (a different domain)? This matters for security, to help prevent attacks where a malicious site tries to "use" your cookies without you knowing (this attack is called CSRF).

sameSite controls this behavior. It can be:

1. "strict":Cookie is only sent when the request comes from the exact same site. Very strict.

2. "lax": Cookie is sent for normal navigation (clicking links, typing URL), but not sent for things like background API calls from a different site. This is the default in most browsers.

3. "none": Cookie is sent everywhere, even from a different site making a background request. But browsers require secure: true (HTTPS) when you use "none".

Why does your code choose based on isProduction?

const isProduction = process.env.NODE_ENV === "production";

In development (on your own computer):

Your frontend runs at http://localhost:3000
Your backend runs at http://localhost:8000

These are technically two different origins (different ports = different origin), but browsers treat localhost more gently, and you're not using HTTPS. So sameSite: "lax" (with secure: false) works fine.

In production (deployed, live website):

Your frontend might be https://multi-vendor-m5ay-nine.vercel.app
Your backend might be https://your-backend.vercel.app (a different domain)

Since frontend and backend are on different domains, the browser treats every API call from frontend to backend as cross-site. If you used "lax" here, the browser would block/skip sending the cookie on these cross-site API calls! That means the user would look "logged out" even though they just logged in.

So in production, you need sameSite: "none" to say "yes, send this cookie even on cross-site requests" — but this only works if secure: true (must be HTTPS), which your code also sets:

javascript
secure: isProduction,
Real-life example

Think of the cookie like a VIP wristband at an event.

"strict" = the wristband only works if you enter through the main gate of the same event. If you try to enter through a side gate from a "different event," it won't scan.
"lax" = the wristband works if you walk in yourself (click a link, type the URL) even from outside, but it won't work if someone else sends it in on your behalf without you walking in (like a background API request).
"none" = the wristband works everywhere, from any gate, any way it's presented — but because it's so open, the security guard demands you also show a secure ID (HTTPS), or they won't accept it.
What happens if you pick the wrong one?
If you use "lax" in production (frontend and backend on different domains): cookie won't be sent, req.cookies.token will be undefined in your auth.js middleware, and the user will constantly be told "Please login to continue" even after logging in. This is a very common real bug in MERN deployment.
If you use "none" without secure: true: modern browsers will reject the cookie completely and refuse to store it.
For your interview

"I set sameSite conditionally based on environment. In development, frontend and backend run on the same machine (localhost) so lax works fine. In production, my frontend and backend are on different domains, so I need sameSite: none plus secure: true (HTTPS) — otherwise the browser won't send my login cookie on cross-site requests, and users would appear logged out."
*/