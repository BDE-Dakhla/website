export interface TestUser {
  cdm: string
  password: string
  name: string
  email: string
}

export const TEST_USERS: Record<string, TestUser> = {
  VALID_USER: {
    cdm: 'R142002537',
    password: 'password123',
    name: 'Test User',
    email: 'test@example.com',
  },
  INVALID_USER: {
    cdm: 'R000000000',
    password: 'wrongpassword',
    name: 'Invalid User',
    email: 'invalid@example.com',
  },
  SHORT_CDM: {
    cdm: 'R123',
    password: 'password123',
    name: 'Short CDM User',
    email: 'short@example.com',
  },
  MALFORMED_CDM: {
    cdm: 'ABC123',
    password: 'password123',
    name: 'Malformed CDM User',
    email: 'malformed@example.com',
  },
}
