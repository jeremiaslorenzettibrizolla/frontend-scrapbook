const userUID = localStorage.getItem('userUID');
// axios.defaults.baseURL = `https://api-backend-database.herokuapp.com/users/${userUID}`;
axios.defaults.baseURL = `http://localhost:8080/users/${userUID}`;

const clearFields = () => {
  uid.value = '';
  title.value = '';
  description.value = '';
};

function alertStatus(httpStatus) {
  if (status === 201) {
    loadTable();
    document.getElementById('scrap-post').classList.remove('none');
    setTimeout(() => {
      document.getElementById('scrap-post').classList.add('none');
    }, 2000);
    return;
  }

  if (status === 202) {
    loadTable();
    document.getElementById('scrap-update').classList.remove('none');
    setTimeout(() => {
      document.getElementById('scrap-update').classList.add('none');
    }, 2000);
    return;
  }

  if (status === 204) {
    loadTable();
    document.getElementById('scrap-delete').classList.remove('none');
    setTimeout(() => {
      document.getElementById('scrap-delete').classList.add('none');
    }, 2000);
    return;
  }
}

async function loadTable() {
  const scrapbook = document.getElementById('scrapbook');

  const { data, status } = await axios.get('/scraps');

  if (data.length === 0) {
    document.getElementById('scrap-not-found').classList.remove('none');
    setTimeout(() => {
      document.getElementById('scrap-not-found').classList.add('none');
    }, 3000);
    return;
  }

  scrapbook.innerHTML = '';

  if (data) {
    for (let scrap of data) {
      const line = document.createElement('tr');
      line.innerHTML = `
          <th scope="row" class"text-cel" id="${scrap.uid}">${
        data.indexOf(scrap) + 1
      }</th>
          <td class"text-cel">${scrap.title}</td>
          <td class"text-cel">${scrap.description}</td>
          <td>
              <div>
                  <button class="col-1 btnAction btn-edit"
                    onclick="updateScrap(event, '${scrap.uid}')">
                      <i class="fa fa-pencil"></i>
                  </button>
                  <button class="col-1 btnAction btn-delete"
                    onclick="deleteScrap(event, '${scrap.uid}')">
                      <i class="fa fa-trash"></i>
                  </button>
              </div>
          </td>
          `;
      scrapbook.appendChild(line);
    }
  }
}
loadTable();

async function postScrap(event) {
  event.preventDefault();

  const uid = document.getElementById('uid');
  const title = document.getElementById('title');
  const description = document.getElementById('description');

  if (!title.value) {
    document.getElementById('scrap-error').classList.remove('none');
    setTimeout(() => {
      document.getElementById('scrap-error').classList.add('none');
    }, 2000);
    return;
  }

  const scrap = {
    title: title.value,
    description: description.value,
    userUID: userUID,
  };

  let response;

  if (!uid.value) {
    response = await axios.post('/scraps', scrap);
  } else {
    response = await axios.put(`/scraps/${uid.value}`, scrap);
  }
  alertStatus(response.status);
  loadTable();
  clearFields();
}

async function updateScrap(event, uid) {
  event.preventDefault();

  const { data } = await axios.get(`/scraps/${uid}`);
  let scrap = {
    editUid: data.scrap.uid,
    editTitle: data.scrap.title,
    editDescription: data.scrap.description,
  };

  document.getElementById('uid').value = scrap.editUid;
  document.getElementById('title').value = scrap.editTitle;
  document.getElementById('description').value = scrap.editDescription;

  loadTable();
}

async function deleteScrap(event, uid) {
  event.preventDefault();

  const response = await axios.delete(`/scraps/${uid}`);

  alertStatus(response.status);

  loadTable();
}
