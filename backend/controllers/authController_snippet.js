
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If password is changed
        if (req.body.password) {
            user.password = await hashPassword(req.body.password);
        }

        const updatedUser = await user.save();

        let profile = null;
        if (user.role === 'student') {
            profile = await Student.findOne({ user: user._id });
            if (profile) {
                profile.rollNo = req.body.rollNo || profile.rollNo;
                profile.branch = req.body.branch || profile.branch;
                profile.year = req.body.year || profile.year;
                profile.gender = req.body.gender || profile.gender;
                await profile.save();
            }
        }

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
            profile: profile
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};
