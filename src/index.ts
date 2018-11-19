/**
 * Created by adithya.sathu on 08/11/2018.
 */
import * as Logger from "simple-node-logger";
import {Server} from "./server";
import * as mongoose from 'mongoose';
import * as emailVerification from 'email-verification';
import * as config from "config";
import {User} from "./models/user";
import * as bcrypt from "bcryptjs";
export const registrationClient = emailVerification(mongoose);
export const log = Logger.createSimpleLogger();

export const mongoInit = async () => {
    log.info("initialising mongodb connection");
    const mongoOptions: any = config.get("mongo");
    // user global promises as mongoose promises
    mongoose.Promise = global.Promise;

    mongoose.connect(mongoOptions.connectionUrl,
        {
            autoReconnect: true,
            reconnectTries: 3, // Number.MAX_VALUE,
            bufferMaxEntries: 0,
            reconnectInterval: mongoOptions.reconnectInterval,
            useNewUrlParser: true,
    });

    return mongoose.connection.on("connected", () => {
        log.info("MongoDB connected");
        return mongoose;
    });

    return mongoose.connection.on("error", (err) => {
        log.error(`MongoDB connection error, ${err}`);
        return err;
    });

    return  mongoose.connection.on("disconnected", () => {
        log.error("Disconnected from MongoDB");
        return mongoose;
    });
};

// async version of hashing function
const hasher = (password, tempUserData, insertTempUser, callback) => {
    bcrypt.genSalt(8, (err, salt) => {
        bcrypt.hash(password, salt, (error, hash) => {
            return insertTempUser(hash, tempUserData, callback);
        });
    });
};

export const registrationClientInit = async () => {

    const emailOptions: any = config.get("email");
    const mailHogServer = emailOptions.mailhog;
    const mailService = emailOptions.server;

    let transportOptions: any = {
        host: mailHogServer.host,
        port: mailHogServer.port,
        secure: mailHogServer.secure, // true for 465, false for other ports
    };
    if (emailOptions.use === "server") {
        transportOptions = {
            service : mailService.service,
            auth: {
                user: mailService.user,
                pass: mailService.pass,
            },
        };
    }

    // User Registration configuration =====================
    registrationClient.configure({
        persistentUserModel: User,
        expirationTime: emailOptions.expirationTime, // in seconds by default 24 hours
        URLLength: emailOptions.urlLength,

        verificationURL: emailOptions.verificationBaseURL + "/${URL}",
        transportOptions,
        passwordFieldName: "password",
        shouldSendConfirmation: emailOptions.shouldSendConfirmation,
        verifyMailOptions: {
            from: "Do Not Reply <" + mailService.user + ">",
            subject: "Confirm your account",
            html: "<p>Please verify your account by clicking <a href=\"${URL}\">this link</a>. If you are unable to do so, copy and " +
                "paste the following link into your browser:</p><p>${URL}</p>",
            text: "Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}",
        },
        confirmMailOptions: {
            from: "Do Not Reply <" + mailService.user + ">",
            subject: "Successfully verified!",
            html: "<p>Your account has been successfully verified.</p>",
            text: "Your account has been successfully verified.",
        },
        hashingFunction: hasher,

    }, (err, options) => {
        if (err) {
            log.error(err);
            return;
        }

        log.info('configured: ' + (typeof options === 'object'));
    });

    registrationClient.generateTempUserModel(User, (err, tempUserModel) => {
        if (err) {
            log.error(err);
            return;
        }

        log.info('generated temp user model: ' + (typeof tempUserModel === 'function'));
    });
};

export const bootstrap = async () => {
    mongoInit();
    registrationClientInit();
    const server = new Server();
    await server.start();
};
