import Context, {Markup} from 'telegraf';
import {Issuer} from "openid-client";

export function init (bot) {
    const basicMainMenu = [
        Markup.button.callback('Register', 'sub_data_register'),
        Markup.button.callback('Unregister', 'sub_data_unregister')
    ]

    bot.start((ctx) => {
        const menu = buildMainMenu(ctx)
        ctx.reply(menu.message, menu.keyboard)
    })

    bot.action('sub_data_register',(ctx) => {
        const keyboard = [
            Markup.button.url('Daftar!', `http://${process.env.HOST}:3000/auth/reg/${ctx.chat.id}`)
        ]
        const urlButton = {
            message: 'Klik link berikut untuk mendaftar akun telegram Anda',
            keyboard: Markup.inlineKeyboard(keyboard)
        }

        ctx.reply(urlButton.message, urlButton.keyboard)
    })

    function buildMainMenu(ctx){
        return {
            message: `Welcome ${ctx.chat.first_name} !`,
            keyboard: Markup.inlineKeyboard(basicMainMenu)
        }
    }
}
