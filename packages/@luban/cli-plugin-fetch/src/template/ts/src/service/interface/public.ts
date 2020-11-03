export interface ResponseData<T> {
  /**
   * status code
   *
   * @type {number}
   */
  code: number;

  /**
   * message
   *
   * @type {number}
   */
  msg?: string;

  /**
   * returned data
   *
   * @type {T}
   */
  data: T;
}
