import fetch from 'node-fetch';
import StellarSdkLibrary = require('stellar-sdk');
import { Config } from '../config';

if (Config.ENV === 'production') {
  StellarSdkLibrary.Network.usePublicNetwork();
} else {
  StellarSdkLibrary.Network.useTestNetwork();
}

export const stellarServer = new StellarSdkLibrary.Server(Config.HORIZON_URL);
export const StellarSdk = StellarSdkLibrary;
const sourceKeys = StellarSdk.Keypair.fromSecret(Config.ISSUER_SEED);
const ASSET_CODE = 'SKYHITZ';
const asset = new StellarSdk.Asset(ASSET_CODE, sourceKeys.publicKey());
const ANCHOR_USD = new StellarSdk.Asset(
  'USD',
  'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5YLEX'
);
const XLM = StellarSdk.Asset.native();

export async function fundTestAccount(publicKey: string) {
  return fetch(`https://friendbot.stellar.org/?addr=${publicKey}`);
}

export async function accountExists(publicKey: string) {
  try {
    await stellarServer.loadAccount(publicKey);
  } catch (e) {
    return false;
  }
  return true;
}

export async function fundAccount(destinationKey: string) {
  let validAccount = await accountExists(destinationKey);
  if (!validAccount) {
    throw 'Account does not exist';
  }
  let sourceAccount = await stellarServer.loadAccount(sourceKeys.publicKey());
  let transaction = new StellarSdk.TransactionBuilder(sourceAccount)
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationKey,
        asset: XLM,
        amount: '1.5'
      })
    )
    .build();
  transaction.sign(sourceKeys);
  return stellarServer.submitTransaction(transaction);
}

export async function createAndFundTestStellarAccount() {
  console.log('creating and funding stellar test account');
  let pair = StellarSdk.Keypair.random();
  let secret = pair.secret();
  let publicAddress = pair.publicKey();
  try {
    await fundTestAccount(publicAddress);
  } catch (e) {
    throw e;
  }
  return {
    secret,
    publicAddress
  };
}

export async function createAndFundPublicStellarAccount() {
  let pair = StellarSdk.Keypair.random();
  let secret = pair.secret();
  let publicAddress = pair.publicKey();
  try {
    await fundAccount(publicAddress);
  } catch (e) {
    throw e;
  }
  return {
    secret,
    publicAddress
  };
}

export async function createAndFundAccount() {
  if (Config.ENV === 'production') {
    return createAndFundPublicStellarAccount();
  }
  return createAndFundTestStellarAccount();
}

export async function allowTrust(destinationSeed: string) {
  const destinationKeys = StellarSdk.Keypair.fromSecret(destinationSeed);
  const account = await stellarServer.loadAccount(destinationKeys.publicKey());
  const transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset,
        limit: '10000000'
      })
    )
    .build();

  transaction.sign(destinationKeys);
  return stellarServer.submitTransaction(transaction);
}

export async function sendSubscriptionTokens(
  destinationKey: string,
  amount: number
) {
  const sourceAccount = await stellarServer.loadAccount(sourceKeys.publicKey());
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount)
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationKey,
        asset,
        amount: amount.toString()
      })
    )
    .build();

  transaction.sign(sourceKeys);
  return stellarServer.submitTransaction(transaction);
}

export async function mergeAccount(accountSeed: string) {
  const destinationKeys = StellarSdk.Keypair.fromSecret(accountSeed);
  const account = await stellarServer.loadAccount(destinationKeys.publicKey());
  let remainingCredits;
  account.balances.forEach((balance: any) => {
    if (balance.asset_code === ASSET_CODE) {
      remainingCredits = balance.balance;
    }
  });
  const transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(
      StellarSdk.Operation.payment({
        destination: sourceKeys.publicKey(),
        asset: asset,
        amount: remainingCredits
      })
    )
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset,
        limit: '0'
      })
    )
    .addOperation(
      StellarSdk.Operation.accountMerge({
        destination: sourceKeys.publicKey()
      })
    )
    .build();

  transaction.sign(destinationKeys);
  return stellarServer.submitTransaction(transaction);
}

export async function accountCredits(publicAddress: string) {
  const { balances }: any = await stellarServer
    .accounts()
    .accountId(publicAddress)
    .call();

  const [currentBalance] = balances.filter(
    (balance: any) => balance.asset_code === ASSET_CODE
  );
  if (currentBalance && currentBalance.balance) {
    return parseInt(currentBalance.balance);
  }
  return 0;
}

export async function payment(
  publicAddress: string,
  seed: string,
  amount: number
) {
  const sourceKeypair = StellarSdk.Keypair.fromSecret(seed);
  const sourcePublicKey = sourceKeypair.publicKey();

  let account = await stellarServer.loadAccount(sourcePublicKey);
  let transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(
      StellarSdk.Operation.payment({
        destination: publicAddress,
        asset,
        amount: amount.toString()
      })
    )
    .build();

  transaction.sign(sourceKeypair);
  let transactionResult = await stellarServer.submitTransaction(transaction);
  console.log('\nSuccess! View the transaction at: ');
  console.log(transactionResult._links.transaction.href);
  return transactionResult;
}

export async function getUSDPrice() {
  let response = await stellarServer.orderbook(ANCHOR_USD, XLM).call();
  return response.records[0].bids[0].price;
}

export async function convertUSDtoXLM(USDAmount: number) {
  if (Config.ENV === 'production') {
    const currentPrice = await getUSDPrice();
    const XLMAmount = USDAmount * currentPrice;
    return XLMAmount;
  }
  // using 12.5 cents as reference
  return USDAmount * 12.5;
}

export async function withdrawalFromAccount(seed: string, amount: number) {
  const sourceKeypair = StellarSdk.Keypair.fromSecret(seed);
  const sourcePublicKey = sourceKeypair.publicKey();

  let account = await stellarServer.loadAccount(sourcePublicKey);
  let transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(
      StellarSdk.Operation.payment({
        destination: sourceKeys.publicKey(),
        asset,
        amount: amount.toString()
      })
    )
    .build();

  transaction.sign(sourceKeypair);
  let transactionResult = await stellarServer.submitTransaction(transaction);
  console.log('\nSuccess! View the transaction at: ');
  console.log(transactionResult._links.transaction.href);
  return transactionResult;
}

export async function payUserInXLM(address: string, amount: number) {
  const sourcePublicKey = sourceKeys.publicKey();

  let account = await stellarServer.loadAccount(sourcePublicKey);
  let transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(
      StellarSdk.Operation.payment({
        destination: address,
        asset: XLM,
        amount: amount.toString()
      })
    )
    .build();

  transaction.sign(sourceKeys);
  let transactionResult = await stellarServer.submitTransaction(transaction);
  console.log('\nSuccess! View the transaction at: ');
  console.log(transactionResult._links.transaction.href);
  return transactionResult;
}
