const makeWASocket, { DisconnectReason } from "@whiskeysockets/baileys";
const { Boom } from "@hapi/boom";

async function Main() {
  const sock = makeWASocket({
    printQRInTerminal: true,
  });

  //Connect	
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect.error as Boom)?.output?.statusCode !==
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

  //Message	
  sock.ev.on("messages.upsert", async (m) => {

    console.log(JSON.stringify(m, undefined, 2));

    console.log("replying to", m.messages[0].key.remoteJid);
    await sock.sendMessage(m.messages[0].key.remoteJid, {
      text: "Hello there!",
    });
  });
}
// run in main file
Main();
