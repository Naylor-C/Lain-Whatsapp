const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");


// Variavel Recursivas
var MText = null;
var Imglain = "https://i.ibb.co/mrXxJJMW/lain2bgpl0.jpg";


async function Main() {
  const { state, saveCreds } = await useMultiFileAuthState("lib/baileys/auth_info_baileys");

  const lain = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  lain.ev.on("creds.update", saveCreds);

  //Connect the function comes 	U = Update//
  lain.ev.on("connection.update", (U) => {
    const { connection, lastDisconnect } = U;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect.error)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  //Message	//
  lain.ev.on("messages.upsert", async (m) => {
    //Definiçoes inicais
    const M = m.messages[0];
    const user = M.key.remoteJid; 
    const pushName = M.pushName;
    const T = M.message.extendedTextMessage.text? || M.message.conversation;


    const F = T.startsWith(prefix);
    const C = F.toLowerCase();

    switch (C) {

      case 'menu':
        MText = `> Lain `;
        await lain.sendMessage(user,
          {
            image: {
              url: {
                Imglain
              },
              caption: MText,
            }
          }, { quoted: M });
        break;

      case 'menu-play':
        MText = `lainbida`;
        await lain.sendMessage(user,
          {
            image: {
              url: {
                Imglain
              },
              caption: MText,
            }
          }, { quoted: M });
        break;


    }

   console.log(JSON.stringify(m, undefined, 2));
  });
}
// run in main file
Main();
