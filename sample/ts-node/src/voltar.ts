/*
 * Copyright 2020 - MATTR Limited
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import express from "express";
import * as path from "path";

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);






app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("src/index.html"));
});




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


  var obj_sig_data = { "Signature:": sig, "Messages:": messages }





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

  // whenever a user connects on port 3000 via
  // a websocket, log that a user has connected
  io.on("connection", function (socket: any) {
    console.log("a user connected");
    // whenever we receive a 'message' we log it out
    socket.on("message", function (message: any) {
      console.log(message);
    });
  });








  // start our simple server up on localhost:3000
  const server = http.listen(3000, function () {
    console.log("listening on *:3000");
  });














};




main();
