import MetaMaskSDK from "@metamask/sdk";
import http from "http"; // use any server framework

const sdk = new MetaMaskSDK({
  dappMetadata: {
    name: "HyperPlay",
    url: "https://hyperplay.com",
  },
  shouldShimWeb3: false, // disable window.web3
});

const provider = sdk.getProvider();

// initialize wallet
(async function wallet() {
  // call this to generate link
  const accountsPromise = provider.request({ method: "eth_requestAccounts" });

  // get link for metamask mobile. Use as QR code
  const link = sdk.getUniversalLink();
  console.log({ link });

  // once user scans QR, get accounts
  const accounts = await accountsPromise;
  console.log({ accounts });
})();

// proxy server
http
  .createServer({}, function (req, res) {
    // if provider is not connected, then return
    if (!provider.isConnected()) return res.end("MetaMask not connected");
    // set response as json
    res.setHeader("Content-Type", "application/json");
    // get request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        // send request body to metamask
        const response = await provider.request(JSON.parse(body));
        // get response and send back to client/game
        res.end(JSON.stringify({ response }));
      } catch (error) {
        res.end(JSON.stringify({ error }));
      }
    });
  })
  .listen(8080);
