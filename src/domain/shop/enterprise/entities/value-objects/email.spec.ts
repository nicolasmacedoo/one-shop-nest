import { Email } from './email'

test('it should be able to validate an email', () => {
  const email = new Email('janedoe@email.com')

  expect(email.isValid()).toBe(true)
})
