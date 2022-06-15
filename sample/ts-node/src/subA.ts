
import { io } from "socket.io-client";

import {
    generateBls12381G2KeyPair,
    blsSign,
    blsVerify,
    blsCreateProof,
    blsVerifyProof,
} from "@mattrglobal/bbs-signatures";

const main = async () => {



    const socket = io("http://localhost:3000");
    socket.on("temp_with_sub_urb", function (data) {
        console.log(data);
      });







};




main();
