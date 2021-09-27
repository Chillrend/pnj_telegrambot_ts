import StatusCodes from 'http-status-codes';
import {Issuer} from "openid-client";
import { Request, Response } from 'express';

import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError } from '@shared/constants';

const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;




/**
 * Get all users.
 *
 * @param req
 * @param res
 * @returns
 */
export async function redirectToSSO(req: Request, res: Response) {
    const ssoPnj = await Issuer.discover('https://sso.pnj.ac.id')
    const client = new ssoPnj.Client({
        client_id: '2933c19c-2797-4025-a4dc-c21f7b8acce3',
        client_secret: 'A4..UlZ2LHnE~ONdd2ceRheRyH',
        redirect_uris: [`http://${process.env.host}:3000/auth/callback`]
    })
    const users = await userDao.getAll();
    return res.status(OK).json({users});
}
