
import { io } from "socket.io-client";

import {
    generateBls12381G2KeyPair,
    blsSign,
    blsVerify,
    blsCreateProof,
    blsVerifyProof,
} from "@mattrglobal/bbs-signatures";

const main = async () => {
    //Generate a new key pair
    const keyPair = await generateBls12381G2KeyPair();

    console.log("Key pair generated");
    console.log(
        `Public key base64 = ${Buffer.from(keyPair.publicKey).toString("base64")}`
    );


    var msg1 = "Info 1";
    var msg2 = "Info 2";

    //Set of messages we wish to sign
    const messages = [
        Uint8Array.from(Buffer.from(msg1, "utf8")),
        Uint8Array.from(Buffer.from(msg2, "utf8")),
    ];

    console.log("Signing a message set of " + messages);

    //Create the signature
    const signature = await blsSign({
        keyPair,
        messages: messages,
    });

    //console.log(`Output signature base64 = ${Buffer.from(signature).toString("base64")}`);

    var sig = Buffer.from(signature).toString("base64");


    const obj_sig_data = { "Signature": sig, "Messages": messages,"PK":keyPair.publicKey }



    const socket = io("http://localhost:3000");
    socket.emit("alldata", obj_sig_data);


    //Verify the signature
    const isVerified = await blsVerify({
        publicKey: keyPair.publicKey,
        messages: messages,
        signature,
    });

    const isVerifiedString = JSON.stringify(isVerified);
    //console.log(`Signature verified ? ${isVerifiedString}`);

    //Derive a proof from the signature revealing the first message
    const proof_msg1 = await blsCreateProof({
        signature,
        publicKey: keyPair.publicKey,
        messages,
        nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
        revealed: [0],
    });

    //console.log(`Output proof base64 = ${Buffer.from(proof).toString("base64")}`);

    //Verify the created proof
    const isProofVerified = await blsVerifyProof({
        proof: proof_msg1,
        publicKey: keyPair.publicKey,
        messages: messages.slice(0, 1),
        nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
    });

    const isProofVerifiedString = JSON.stringify(isProofVerified);
    //console.log(`Proof verified ? ${isProofVerifiedString}`);






};




main();
