//create token and saving in cookies
const  sendShopToken = (seller, statusCode, res) => {
    const token = seller.getJwtToken();

    const isProduction = process.env.NODE_ENV === "production";

    //options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    };

    res.status(statusCode).cookie("seller_token", token, options).json({
        success: true,
        seller,
        token,
    })
}

module.exports =  sendShopToken;