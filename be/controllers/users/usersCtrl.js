const expressAsyncHandler = require('express-async-handler');
const User = require('../../model/User');
const generateToken = require('../../config/token/generateToken')
const validateMongodbId = require('../../utils/validateMongodbId')
const crypto = require("crypto");

const userRegisterCtrl = expressAsyncHandler(
    async (req, res, next) => {
        console.log('api called');
        const userExist = await User.findOne({email: req.body.email});
        if (userExist) throw new Error('User already exists');
        try {
            const user = await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            })
            res.json({ user: user})
        }
        catch(error) {
            console.log(error)
        }
        
    }
);

const userLoginCtrl = expressAsyncHandler(
    async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email})
        if (!user) {
            throw Error('User not exist!');
        } else {
            const isMatched = await user.isPasswordMatch(req.body.password);
            console.log(isMatched, ' : matched')
            if (isMatched) {
                res.json({
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user.id)
                })
            } else {
                throw Error('Invalid password!');
            }
        }
    }
);


const userListCtrl = expressAsyncHandler(
    async (req, res, next) => {
        // console.log(req.headers);
        try {
            const users = await User.find();
            res.json(users);
        } 
        catch (error) {
            res.json(error)
        }
    }
)

const userDeleteCtrl = expressAsyncHandler(
    async (req, res, next) => {
        const userId = req.params.id;
        validateMongodbId(userId);
        try {
            const deletedUser = await User.findByIdAndDelete({ _id: userId });
            res.json(deletedUser);
        } 
        catch (error) {
            res.json(error)
        }
    }
)

const fetchUserDetailCtrl = expressAsyncHandler(
    async (req, res, next) => {
        validateMongodbId(req.params.id);
        const user = await User.findOne({ _id: req.params.id})
        if (!user) {
            throw Error('User not exist!');
        } else {
            res.json(user);
        }
    }
);

const fetchUserProfileCtrl = expressAsyncHandler(
    async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);
        try {
            const user = await User.findById(id).populate('posts')
            res.json(user);
        }
        catch(error) {
            res.json(error) 
        }
    }
);

const updateUserCtrl = expressAsyncHandler(
    async (req, res, next) => {
        const { _id } = req.user;
        validateMongodbId(_id);
        try {
            const updatedUser = await User.findByIdAndUpdate(_id, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                bio: req.body.bio
            }, 
            {
                new: true,
                runValidators: true
            });
            res.json(updatedUser);
        }
        catch (error) {
            res.json(error)
        }
    }
)

const updatePasswordCtrl = expressAsyncHandler(
    async (req, res, next) => {
        const { _id } = req.user;
        const pass = req.body.password;
        validateMongodbId(_id);
        const user = await User.findById(_id);
        if (pass && _id) {
            user.password = pass;
            const updatedUser = await user.save();
            res.json(updatedUser);
        }
        res.json(user)
    }
)

const blockUserCtrl = expressAsyncHandler(
    async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);

        const user = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true
            }
        )
        res.json(user);
    }
)

const unBlockUserCtrl = expressAsyncHandler(
    async (req, res, next) => {
        const id = req.params.id;
        validateMongodbId(id);

        const user = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true
            }
        )
        res.json(user);
    }
)


//------------------------------
// Generate Email verification token
//------------------------------
const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
    const loginUserId = req.user.id;
    const user = await User.findById(loginUserId);
    try {
      //Generate token
      const verificationToken = await user.createAccountVerificationToken();
      //save the user
      await user.save();
      res.json(verificationToken);
    } catch (error) {
      res.json(error);
    }
  });
  
  //------------------------------
  //Account verification
  //------------------------------
  
  const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
    const { token } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
    //find this user by token
    const userFound = await User.findOne({
      accountVerificationToken: hashedToken,
      accountVerificationTokenExpires: { $gt: new Date() },
    });
    if (!userFound) throw new Error("Token expired, try again later");
    //update the proprt to true
    userFound.isAccountVerified = true;
    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationTokenExpires = undefined;
    await userFound.save();
    res.json(userFound);
  });

// Forget password
const forgetPasswordCtrl = expressAsyncHandler(
    async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({email});
        if (!user) throw new Error("User not found!");
        try {
            const token = await user.passwordResetingToken();
            const msg = `Reset link is send here. Here is reset link
                http://localhost:5000/api/users/reset-passsword/${token}`
            await user.save();
            res.json({ 'msg': msg});
        } catch (error) {
            console.log(error)
        }
    }
);

// Forget password
const passwordResetCtrl = expressAsyncHandler(
    async (req, res) => {
        const { password, token } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({ 
            passwordResetToken: hashedToken,
            passwordResetTokenExpires:{ $gt: Date.now() } 
        });
        if(!user) throw new Error('User not found!');

        // update or change passs
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();
        res.json(user);
    }
);

// Forget password
const photoUploadCtrl = expressAsyncHandler(
    async (req, res) => {
        const { _id } = req.user;
        const localPath = `./public/data/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            _id,
            {
                profilePhoto: localPath
            },
            { new: true }
        )
        res.json(user)
    }
);

module.exports = { 
    userRegisterCtrl,
    userLoginCtrl,
    userListCtrl,
    userDeleteCtrl,
    fetchUserDetailCtrl,
    fetchUserProfileCtrl,
    updateUserCtrl,
    updatePasswordCtrl,
    blockUserCtrl,
    unBlockUserCtrl,
    generateVerificationTokenCtrl,
    accountVerificationCtrl,
    forgetPasswordCtrl,
    passwordResetCtrl,
    photoUploadCtrl
};