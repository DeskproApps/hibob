import type { HiBobAPIError } from "./types";

export type InitData = {
  status: number,
  data: HiBobAPIError,
};

class HiBobError extends Error {
  status: number;
  data: HiBobAPIError;

  constructor({ status, data }: InitData) {
    const message = "Asana Api Error";
    super(message);

    this.data = data;
    this.status = status;
  }
}

export { HiBobError };
