import { checkCode, File } from '../src/typecheckingFunctions';

const tsValid = "let mest: string = 'aa';";

const tsUnvalid = `interface A { b: 'c' };
  const e : A = { b: 123 };`;

test('Typechecks valid ts code and finds no errors', () => {
  expect(checkCode(tsValid)).toStrictEqual([]);
});

test('Typechecks invalid ts code and does find errors', () => {
  expect(checkCode(tsUnvalid)).toStrictEqual([
    {
      message: "Type 'number' is not assignable to type '\"c\"'.",
      location: '(test.ts:2:19)',
    },
  ]);
});
