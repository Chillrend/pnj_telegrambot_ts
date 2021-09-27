import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, {NextFunction, Request, Response} from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import {TelegramBot} from "./telegram/bot";

import BaseRouter from './routes';
import logger from '@shared/Logger';

const app = express();
const {BAD_REQUEST} = StatusCodes;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const WEBHOOK_HOST = process.env.WEBHOOK_HOST;
const WEBHOOK_PATH = `/tl-webhook-${TELEGRAM_BOT_TOKEN}`;
const bot = TelegramBot.Instance;

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    // app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});

/************************************************************************************
 *                              Set telegraf settings
 ***********************************************************************************/

if (WEBHOOK_HOST) {
    app.use(bot.webhookCallback(WEBHOOK_PATH))
    bot.telegram.setWebhook(`${WEBHOOK_HOST}${WEBHOOK_PATH}`)
    console.log(`Bot is using webhook for host '${WEBHOOK_HOST}!'`)
} else {
    bot.telegram.deleteWebhook(`${WEBHOOK_HOST}${WEBHOOK_PATH}`)
    bot.launch()
    console.log(`Bot is using polling mode!`)
}

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('*', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});

// Export express instance
export default app;
