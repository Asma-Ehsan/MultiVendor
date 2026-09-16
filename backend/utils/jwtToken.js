//create token and saving in cookies
const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const isProduction = process.env.NODE_ENV === "production";

    //options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
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