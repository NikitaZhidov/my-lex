import axios from 'axios';

const main = async () => {
  const createUser = {
    email: 'test-user@test.com',
    name: 'User123',
    password: '123456',
    passwordRepeat: '123456',
  };

  const apiUrl = process.env['API_BASE_URL'] || 'http://localhost:3001';
  axios.defaults.baseURL = apiUrl;

  await axios.post('/auth/register', createUser);
};

main().catch(err => console.error(err));
