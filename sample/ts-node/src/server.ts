import express from "express";
//import io from "socket.io";
import * as path from "path";

import {
    generateBls12381G2KeyPair,
    blsSign,
    blsVerify,
    blsCreateProof,
    blsVerifyProof,
} from "@mattrglobal/bbs-signatures";

const main = async () => {
    var keyPair = await generateBls12381G2KeyPair();


    const app = express();
    app.set("port", process.env.PORT || 3000);

    let http = require("http").Server(app);
    // set up socket.io and bind it to our
    // http server.
    //let io = require("socket.io")(http);

    //server settings
    const io = require('socket.io')(http, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            transports: ['websocket', 'polling'],
            credentials: true
        },
        allowEIO3: true
    });



    app.get("/", (req: any, res: any) => {
        res.sendFile(path.resolve("src/index.html"));
    });


    var pacote;
    //Derive a proof from the signature revealing the first message


    // whenever a user connects on port 3000 via
    // a websocket, log that a user has connected
    io.on("connection", async (socket: any) => {
        console.log("a user connected");
        

                    //Generate a new key pair
                    const keyPair = await generateBls12381G2KeyPair();

                    console.log("Key pair generated");
                    console.log(
                        `Public key base64 = ${Buffer.from(keyPair.publicKey).toString("base64")}`
                    );
        
        
                    var temp = "32degc";
                    var gps_lat = "30";
                    var gps_long = "123";
                    var sub_urb = "2398";
                    const messages_plain_text_temp_sub_urb = [temp,sub_urb];
                    const messages_plain_text_temp_gps = [temp,gps_lat,gps_long];   
                    //Set of messages we wish to sign
                    const messages = [
                        Uint8Array.from(Buffer.from(temp, "utf8")),
                        Uint8Array.from(Buffer.from(sub_urb, "utf8")),
                        Uint8Array.from(Buffer.from(gps_lat, "utf8")),
                        Uint8Array.from(Buffer.from(gps_long, "utf8")),
                        
                    ];
        
                    console.log("Signing a message set of " + messages);
        
                    //Create the signature
                    const signature = await blsSign({
                        keyPair,
                        messages: messages,
                    });
        


                    
                    //console.log(`Output signature base64 = ${Buffer.from(signature).toString("base64")}`);
        
        
        
                    const proof_temp_with_sub_urb = await blsCreateProof({
                        signature,
                        publicKey: keyPair.publicKey,
                        messages,
                        nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
                        revealed: [0,1],
                    });
                    const proof_temp_with_gps = await blsCreateProof({
                        signature,
                        publicKey: keyPair.publicKey,
                        messages,
                        nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
                        revealed: [2,3],
                    });
        
                    //topic 1
                    const packt1 = {"proof": proof_temp_with_sub_urb, "messages":messages_plain_text_temp_sub_urb}
                    socket.emit("temp_with_sub_urb", packt1);
                    //topic 2
                    const packt2 = {"proof": proof_temp_with_gps, "messages":messages_plain_text_temp_gps}
                    socket.emit("temp_with_gps", packt2);














        socket.on("alldata", async (message: any) => {


            //socket.emit("temperature", "aeeee");






        });
    });



    const server = http.listen(3000, function () {
        console.log("listening on *:3000");

    });


}


main();
