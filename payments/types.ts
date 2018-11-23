export type CustomerPayload = {
  email: string;
  cardToken: string;
};

export type UpdateCustomerPayload = {
  customerId: string;
  publicAddress: string;
  seed: string;
};
