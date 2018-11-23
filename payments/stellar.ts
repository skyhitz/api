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
let sourceKeys = StellarSdk.Keypair.fromSecret(Config.ISSUER_SEED);

const ASSET_CODE = 'SKY';
const asset = new StellarSdk.Asset(ASSET_CODE, sourceKeys.publicKey());

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
        asset: StellarSdk.Asset.native(),
        amount: '1.5'
      })
    )
    .build();
  transaction.sign(sourceKeys);
  return stellarServer.submitTransaction(transaction);
}

export async function createAndFundTestStellarAccount() {
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
        limit: '3600'
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
        asset: asset,
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
