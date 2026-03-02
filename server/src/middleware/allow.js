function guard(allow) {
    return async (_, res) => {
        if (allow !== "true") {
            return res.code(404).send({
                statusCode: 404,
                message: "Route not found.",
            });
        }
    };
}

export default {
    register: guard(process.env.ENABLE_REGISTER),
    login: guard(process.env.ENABLE_LOGIN),
};
