import { ethers } from 'ethers';


export const suggestToken = async (provider: ethers.providers.Web3Provider, address: string, symbol: string, decimals: string, image: string) => {
  await provider.send('metamask_watchAsset',
  {
    "type":"ERC20",
    "options":{
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
    '0x2a3bFF78B79A009976EeA096a51A948a3dC00e34',
    'WILD',
    '18',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/9674.png',
  );
};