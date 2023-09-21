import * as crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import * as path from "path";
import config from '../config/config';
import logging from '../config/logging';

const NAMESPACE = 'Auth';


const signJWT = (userId: string, callback: (error: Error | null, token: string | null) => void): void => {
    var timeSinceEpoch = new Date().getTime();
    var expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
    var expirationTimeInSeconds = '1h';
    var fs = require('fs');
    logging.info(NAMESPACE, `Attempting to sign token for ${userId}`);

    try {
        const privateKey = fs.readFileSync(path.join(__dirname, './../resources/access_token/private.key'));
        const signInOptions: SignOptions = {
            algorithm: 'RS256',
            expiresIn: '1h'
        };
        jwt.sign(
            {
                id: userId
            },
            privateKey,
            {
                issuer: config.server.token.issuer,
                algorithm: 'RS256',
                expiresIn: expirationTimeInSeconds
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
};

export default signJWT;