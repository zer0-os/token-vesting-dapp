import { ethers } from 'ethers';


export const suggestToken = async (provider: ethers.providers.Web3Provider, address: string, symbol: string, decimals: string, image: string) => {
  await provider.send('metamask_watchAsset',
    {
      "type": "ERC20",
      "options": {
        "address": address,
        "symbol": symbol,
        "decimals": decimals,
        "image": image,
      },
    } as unknown as any[]);
}

export const suggestWildToken = async (provider: ethers.providers.Web3Provider) => {
  suggestToken(
    provider,
    '0x0eC78ED49C2D27b315D462d43B5BAB94d2C79bf8',
    'ZERO',
    '18',
    // TODO: add image from our own domain which will be always available
    'https://image.cypherhunter.com/upload/img/p/42d0a0da56576d3d9c7ab359fd6bc42f.jpg-resized',
  );
};