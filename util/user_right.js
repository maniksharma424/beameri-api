export async function checkUserPermission(req, res, next, whatFor) {
    try {
        if (req.user != null && !req.user.userType.includes("admin") && !req.user.rights[whatFor]) {
            return res
                .status(403)
                .json({ status: "failed", error: `you don't have permission to ${whatFor} this route` });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: "failed",
            message: "Server Error",
        });
    }
};