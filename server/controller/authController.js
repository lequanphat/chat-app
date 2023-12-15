import userModel from '../model/userModel.js';
import { saveCookie } from '../utils/CookieService.mjs';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/JWTService.js';
import brcypt from 'bcrypt';

import { registerSchema } from '../utils/schemaService.js';
import { OtpGenerator } from '../utils/OTPService.js';
import { sendMail } from '../utils/MailService.js';
import { BACKEND_SERVER_PATH } from '../config/index.js';
const authController = {
    register: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            // check data
            const { value, error } = registerSchema.validate({ email, password });
            if (error) {
                return res.status(200).json({ msg: error.message, status: false });
            }

            // check user exists
            const emailCheck = await userModel.findOne({ email });
            if (emailCheck) {
                return res.status(200).json({ msg: 'Email is already used', status: false });
            }

            // create user
            const salt = await brcypt.genSalt();
            const hashedPassword = await brcypt.hash(password, salt);

            const { verifyCode, verifyCodeExpiredTime } = OtpGenerator();
            console.log({ verifyCode });
            const user = await userModel.create({
                displayName: email,
                email,
                password: hashedPassword,
                verified: false,
                verifyCode: verifyCode,
                verifyCodeExpiredTime: verifyCodeExpiredTime,
            });
            const { error: er } = sendMail({
                email,
                subject: 'Verify your account',
                text: `Click the link to verify your account: ${BACKEND_SERVER_PATH}/api/auth/verify-account/${user.id}/${verifyCode}`,
            });
            if (er) {
                return res.status(200).json({ msg: 'Error in send mail', status: false });
            }
            return res.status(200).json({ msg: 'Send OTP successfully', status: false });
        } catch (error) {
            return res.status(200).json({ msg: error.message, status: false });
        }
    },
    verifyAccount: async (req, res, next) => {
        try {
            const { id, code } = req.params;
            const user = await userModel.findOne({
                _id: id,
                verifyCode: code,
                verifyCodeExpiredTime: { $gt: Date.now() },
            });
            if (!user) {
                return res.status(200).json({ msg: 'Verify-Code has expired', status: false });
            }
            const newUser = await userModel.findOneAndUpdate({ _id: id }, { $set: { verified: true } }, { new: true });
            return res.status(200).json({ newUser, status: true });
        } catch (error) {
            return res.status(200).json({ msg: 'Error in verify account', status: false });
        }
    },
    login: async (req, res, next) => {
        try {
            // Authentication
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(200).json({ msg: 'Incorrect email', status: false });
            }
            const isPasswordValid = await brcypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(200).json({ msg: 'Incorrect password', status: false });
            }

            // Authorrization
            const accessToken = signAccessToken({ id: user.id });
            const refreshToken = signRefreshToken({ id: user.id });
            saveCookie(res, 'access_token', accessToken);
            saveCookie(res, 'refresh_token', refreshToken);
            const { password: pw, ...newUser } = user._doc;
            console.log(newUser);
            return res.status(200).json({ user: newUser, token: accessToken, status: true });
        } catch (error) {
            return res.status(200).json({ msg: 'Error in login', status: false });
        }
    },
    logout: async (req, res, next) => {
        try {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            return res.json({ msg: 'logout' });
        } catch (error) {
            next(error);
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.cookies['refresh_token'];
            const { err, data } = verifyRefreshToken(refreshToken);
            console.log(data);
            if (err) {
                return next(new Error('Refresh token has expired kkk'));
            }
            const user = await userModel.findOne({ _id: data.id });
            if (!user) {
                return next(new Error('Unauthorized no match'));
            }

            const accessToken = signAccessToken({ id: user.id });
            const newRefreshToken = signRefreshToken({ id: user.id });
            saveCookie(res, 'access_token', accessToken);
            saveCookie(res, 'refresh_token', newRefreshToken);

            const { password: pw, ...newUser } = user._doc;
            console.log(newUser);

            return res.status(200).json({
                user: newUser,
            });
        } catch (error) {
            return next(new Error('Unauthorized kkk'));
        }
    },
};

export default authController;
