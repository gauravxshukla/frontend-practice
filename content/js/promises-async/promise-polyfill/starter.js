export default class MyPromise {
  /**
   * @param {(resolve: (value: any) => void, reject: (reason: any) => void) => void} executor
   */
  constructor(executor) {
    // Your code here
  }

  /**
   * @param {(value: any) => any} [onFulfilled]
   * @param {(reason: any) => any} [onRejected]
   * @return {MyPromise}
   */
  then(onFulfilled, onRejected) {
    // Your code here
  }

  /**
   * @param {(reason: any) => any} [onRejected]
   * @return {MyPromise}
   */
  catch(onRejected) {
    // Your code here
  }

  /**
   * @param {() => any} [onFinally]
   * @return {MyPromise}
   */
  finally(onFinally) {
    // Your code here
  }

  /** @return {MyPromise} */
  static resolve(value) {
    // Your code here
  }

  /** @return {MyPromise} */
  static reject(reason) {
    // Your code here
  }
}
