export default async (req, res) => {
    // prettier-ignore
    try { await req.jwtVerify(); } catch (e) {
        return res.code(401).send({
            statusCode: 401,
            message: "Invalid token."
        });
    }
};
