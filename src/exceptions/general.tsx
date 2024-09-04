import {toast} from "react-hot-toast";

/**
 * Base error structure in this web app.
 */
export class BaseError extends Error {
  name: string;

  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

/**
 * A react-hot-toast custom popper
 * @param e
 */
export function errorPopper(e: any) {

  // If the error has the custom format used by this web app.
  if (e.name !== undefined && e.message !== undefined) {

    toast.error(`${e.message} (${e.name})`)
  }
  // Else, use general schema
  else {
    toast.error(e.message);
  }
}