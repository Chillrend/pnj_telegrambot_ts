import {Telegraf} from 'telegraf';

//INSERT BOT COMMANDS AS IMPORTS
// import * as commandname from './commands/abc'
import * as start from './commands/start'

const TELEGRAM_TOKENS =  process.env.BOT_TOKEN;

export class TelegramBot {

    private static botInstance: any

    private static commands = [
        start
    ]

    public static get Instance(){
        if(this.botInstance){
            return this.botInstance
        } else {
            this.botInstance = new Telegraf(TELEGRAM_TOKENS)
            this.commands.forEach(c => c.init(this.botInstance))
            return this.botInstance
        }
    }

}
