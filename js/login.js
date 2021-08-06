// axios.defaults.baseURL = "https://api-backend-database.herokuapp.com";
axios.defaults.baseURL = 'http://localhost:8080';

const username = document.getElementById('register-username');
const email = document.getElementById('register-email');
const password = document.getElementById('register-password');
const repeatPassword = document.getElementById('repeat-password');
const emailLogin = document.getElementById('current-email');
const passwordLogin = document.getElementById('current-password');

const checkFields = () => {
  if (username.value === '' || email.value === '' || password.value === '') {
    alert('Todos os campos devem ser preenchidos!');
    return;
  }

  if (password.value !== repeatPassword.value) {
    alert('As senhas devem ser iguais');
    return;
  }

  if (password.value.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres');
    return;
  }
  return;
}

const clearFields = () => {
  username.value = '';
  email.value = '';
  password.value = '';
  repeatPassword.value = '';
}

async function addNewUser(event) {
  event.preventDefault();

  checkFields();
  const { data, status } = await axios.get('/users');

  for (let user of data) {

    if (email.value === user.email) {
      alert('Este email já esta em uso');
      email.value = '';
      return;
    }

    if (email.value === '' || null) {
      alert('o campo email esta vazio');
      return;
    }
  }

  const registerUser = axios.post('/users', {
    username: username.value,
    email: email.value,
    password: password.value,
  });

  clearFields();
  alert('Usuário cadastrado com sucesso');
  container.classList.remove('sign-up-mode');
}

async function login(event) {
  event.preventDefault();

  const { data } = await axios.get('/users');

  for (let user of data) {
    if (
      user.email === emailLogin.value &&
      user.password === passwordLogin.value
    ) {
      localStorage.setItem('userUID', user.uid)
      localStorage.setItem('username', user.username)

      window.location.href = 'scrapbook.html';
    }
  }

}

