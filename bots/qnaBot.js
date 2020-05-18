// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActionTypes, ActivityHandler, CardFactory, MessageFactory } = require('botbuilder');
const BDatos = require('./bd.js')
var express = require('express');
var app = express();


let usuariovpn = 'djrevelo';
let namepc = 'UIOOAS76DF';
let ipuser = '';
let contador = 0;
let apoyo = '';


/**
 * A simple bot that responds to utterances with answers from QnA Maker.
 * If an answer is not found for an utterance, the bot responds with help.
 */
class QnABot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState) throw new Error('[QnABot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[QnABot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[QnABot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.onMessage(async (context, next) => {


            console.log('Running dialog with Message Activity.');
            //console.log(context._activity.text);

            if (context._activity.text == '2.- Analizar VPN' || context._activity.text == 'Generar Ticket' || contador == 1 || contador == 2 || contador == 3) {
                //console.log(context._activity.text)
                if (contador == 0) {
                    await context.sendActivity('Ingresa nombre de usuario: ');

                }

                if (contador == 1) {
                    usuariovpn = context._activity.text;
                    await context.sendActivity('Ingresa el nombre de tu equipo: ');
                    console.log('Tu nombre de usuario es: ' + usuariovpn)
                    //context._activity.text === '2.- Analizar VPN';

                    apoyo = context._activity.text

                }

                if (contador == 2) {
                    namepc = context._activity.text;
                    console.log('El nombre de tu equipo: ' + namepc)

                    await context.sendActivity('Ingresa la ip de tu equipo: ');
                    apoyo = context._activity.text
                }
                if (contador == 3) {
                    ipuser = context._activity.text;
                    console.log('Tu IP es: ' + ipuser)

                    await context.sendActivity('Gracias, se realizara el analisis de tu VPN');
                    await BDatos.InsertarBD(usuariovpn,namepc,ipuser);
                    //apoyo = context._activity.text

                    apoyo == '';
                }
                contador++

                /*
                if (contador == 3){

                    await context.sendActivity('Ingresa la ip de tu equipo: ');
                    apoyo=='';

                }
                // await this.InsertarBD();
                //await this.LlenarDatos(context);
                contador++
                if (contador==4){
                    contador == 0;
                }*/


            }
            // Run the Dialog with the new message Activity.
         //   console.log('la variable apoyo es: ' + apoyo)
            if (context._activity.text == '2.- Analizar VPN' || context._activity.text == 'Generar Ticket' || context._activity.text == apoyo) {

               // console.log('Entra a la opcion 1')

            } else {
                apoyo = '';
                contador = 0;

                await this.dialog.run(context, this.dialogState);
                await next();

            }
            // By calling next() you ensure that the next BotHandler is run.
        });

        // If a new user is added to the conversation, send them a greeting message
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {

                    await context.sendActivity('¡Bienvenido colaborador BP👨‍💻! \n Estoy capacitado para solucionar problemas que tengas con tu conexion VPN.');
                    await this.sendSuggestedActions(context);
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
          //  console.log('entro en dialogo')
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }



    async sendIntroCard(context) {
        const card = CardFactory.adaptiveCard({
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": 2,
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Ingresa la informacion para Analizar tu VPN",
                                    "weight": "bolder",
                                    "size": "medium"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "Ingresa la informacion correcta.",
                                    "isSubtle": true,
                                    "wrap": true
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "Nombre de usuario VPN",
                                    "wrap": true
                                },
                                {
                                    "type": "Input.Text",
                                    "id": "myName",
                                    "placeholder": "Last, First"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "Ingresa tu email",
                                    "wrap": true
                                },
                                {
                                    "type": "Input.Text",
                                    "id": "myEmail",
                                    "placeholder": "youremail@example.com",
                                    "style": "email"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "Ingresa el nombre de tu equipo"
                                },
                                {
                                    "type": "Input.Text",
                                    "id": "myTel",
                                    "placeholder": "UIOMIEQUIPO865",
                                    "style": "tel"
                                }
                            ]
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Submit"
                }
            ]
        });

        const message = MessageFactory.attachment(card);

        await context.sendActivity(message);

    }


    async sendSuggestedActions(turnContext) {
        /* var reply = MessageFactory.suggestedActions(['¿Quieres analizar el estado de tu VPN?', '¿Quieres ver soluciones de errores comunes?', 'Salir'], 'Selecciona una opción: ');
         await turnContext.sendActivity(reply);*/

        const message = MessageFactory.list([

            CardFactory.heroCard('Si deseas iniciar🤳 dale clic en el siguiente boton:', ['imageUrl1'], ['Iniciar'])
        ]);
        await turnContext.sendActivity(message);


    }

    async InsertarBD435345() {
        var connection = new Connection(config);
        connection.on('connect', function (err) {
            // If no error, then good to proceed.
            console.log("Connected");
            request = new Request("INSERT UserVPN (nameuser, namepc, ipuser) VALUES ('davidreve','UOIAD','8937432432');", function (err) {
                if (err) {
                    console.log(err);
                }
            });
            connection.execSql(request);
        });
    }

}

module.exports.QnABot = QnABot;
