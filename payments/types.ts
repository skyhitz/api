export type CustomerPayload = {
  email: string;
  cardToken: string;
};

export type BuyCreditsPayload = {
  email: string;
  cardToken: string;
  amount: number;
};

export type UpdateCustomerPayload = {
  customerId: string;
  publicAddress: string;
  seed: string;
};
