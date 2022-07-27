import MetaMaskSDK from "@metamask/sdk";
import { ethers } from "ethers";

const sdk = new MetaMaskSDK({
  dappMetadata: {
    name: "HyperPlay",
    url: "https://hyperplay.com",
  },
  shouldShimWeb3: false, // do not use window.web3
});

const provider = sdk.getProvider();

main();
async function main() {
  // call this to generate link
  const accountsPromise = provider.request({ method: "eth_requestAccounts" });

  // get link for metamask mobile. Use as QR code
  const link = sdk.getUniversalLink();
  console.log({ link });

  // once user scans QR, get accounts
  const accounts = await accountsPromise;
  console.log({ accounts });

  // balance is in hex: https://metamask.github.io/api-playground/api-documentation/#eth_getBalance
  const balance = await provider.request({ method: "eth_getBalance", params: [accounts[0]] });
  console.log({ balance });
  // convert hex to wei (smallest unit)
  const wei = parseInt(balance);
  console.log({ wei });
  // convert wei to ether
  const ether = ethers.utils.formatEther(balance);
  console.log({ ether });
}
