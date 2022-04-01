import { checkCode } from '../src/typecheckingFunctions';

const tsValid = "let x: string  = 'string'";
const tsUnvalid = `interface A { b: 'c' };
const e : A = { b: 123 };`;

const pathToValidTsCode =
  '/home/andrejus.novatorovas/Desktop/ts-udem/jbook/packages/local-api/tests/dummyValid.ts';
const pathToInvalidTsCode =
  '/home/andrejus.novatorovas/Desktop/ts-udem/jbook/packages/local-api/tests/dummyInvalid.ts';

test('Typechecks valid ts code and finds no errors', () => {
  expect(checkCode(pathToValidTsCode)).toStrictEqual([]);
});

test('Typechecks invalid ts code and does find errors', () => {
  expect(checkCode(pathToInvalidTsCode)).toStrictEqual([
    {
      message: "Type 'number' is not assignable to type '\"c\"'.",
      location:
        '(/home/andrejus.novatorovas/Desktop/ts-udem/jbook/packages/local-api/tests/dummyInvalid.ts:4:16)',
    },
  ]);
});
