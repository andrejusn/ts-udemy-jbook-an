import { checkCode } from '../src/typecheckingFunctions';
import supertest from 'supertest';
import { serve } from '../src';

const tsValid = "let mest: string = 'aa';";

const tsUnvalid = `interface A { b: 'c' };
  const e : A = { b: 123 };`;

test('Typechecks valid ts code and finds no errors', () => {
  expect(checkCode('id1', tsValid)).toStrictEqual([]);
});

test('Typechecks invalid ts code and does find errors', () => {
  expect(checkCode('id2', tsUnvalid)).toStrictEqual([
    {
      message: "Type 'number' is not assignable to type '\"c\"'.",
      location: '(test.ts:2:19)',
    },
  ]);
});

// test('test works', async () => {
//   const server = await serve(3001, 'test', './', false);
//   console.log(server);
//   await supertest(server)
//     .get('/test')
//     .expect(200)
//     .then((response) => {
//       expect(response.body.status).toBe('ok');
//     });
// });
