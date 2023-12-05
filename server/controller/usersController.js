import userModel from '../model/userModel.js';
const userController = {
    setAvatarImage: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { avatar } = req.body;
            if (id === undefined) {
                return res.json({ msg: 'Where is id?', status: false });
            }
            const newUser = await userModel.findOneAndUpdate(
                { _id: id },
                { avatarImage: avatar },
                {
                    new: true,
                    runValidators: true,
                },
            );
            return res.json({ status: true, user: newUser });
        } catch (error) {
            next(error);
        }
    },
    getUser: async (req, res, next) => {
        try {
            const { id } = req.user;
            const user = await userModel.findById(id);
            const { password, ...newUser } = user._doc;
            return res.status(200).json({ status: true, user: newUser });
        } catch (error) {
            return res.status(200).json({ status: false, message: 'Unautenticated' });
        }
    },
    getAllUsers: async (req, res, next) => {
        try {
            const users = await userModel
                .find({ _id: { $ne: req.params.id } })
                .select(['email', 'username', 'avatar', '_id']);
            console.log(users);
            return res.json(users);
        } catch (error) {
            next(error);
        }
    },
};

export default userController;
