declare module 'node:test' {
  export interface TestContext {
    test: (name: string, fn: (t: TestContext) => void | Promise<void>) => Promise<void>;
  }
  function test(name: string, fn: ((t: TestContext) => void | Promise<void>) | (() => void | Promise<void>)): Promise<void>;
  export default test;
  export { test };
}

declare module 'node:assert' {
  interface Assert {
    strictEqual: (actual: unknown, expected: unknown, message?: string) => void;
    ok: (value: unknown, message?: string) => void;
    deepStrictEqual: (actual: unknown, expected: unknown, message?: string) => void;
  }
  const assert: Assert;
  export default assert;
  export { assert };
}
