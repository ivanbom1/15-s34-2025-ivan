import { fetchData } from "./utils/fetchData.js";
import { formFactory } from "./utils/formFactory.js";
import { putData } from "./utils/putData.js";

const remoteUrl = "https://easy-simple-users-rest-api.onrender.com/api/users";
const localUrl = "./mock-data/response.json";
const alert = document.querySelector(".alert");
const spinner = document.querySelector(".spinner-border");

let users = []; // ← ADD THIS LINE
const displayUsers = (localUsers) => {
  if (!users || users.length === 0) {
    alert.classList.remove("d-none");
    alert.classList.add("alert-danger");
    alert.innerHTML = "No users found.";
    return;
  }
  localUsers.forEach((user) => {
    const usersContainer = document.getElementById("users-container");
    usersContainer.innerHTML += `
		<article class="card">
				<div class="card-image">
					<img src="${user.avatar_url}" alt="${user.name}" class="card-img-top" />
					<span class="card-title">${user.name}</span>
				</div>

				<div class="card-content">
					<ul class="list-group">
						<li class="list-group-item"><strong>Name:</strong>${user.name}</li>
						<li class="list-group-item"><strong>Age:</strong>${user.age}</li>
						<li class="list-group-item">
							<strong>Gender:</strong> ${user.gender}
						</li>
					</ul>
					<button data-user-id="${user.id}" data-bs-target="#exampleModal" data-bs-toggle="modal" class="edit-btn btn btn-secondary m-2">Edit</button>
				</div>
			</article>
`;
  });
};

const addEventListeners = (e) => {
  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      document.querySelector(".modal-body").innerHTML = "";
      document.querySelector(".modal-body").appendChild(formFactory());
      const foundUser = users.find(
        (user) => user.id === parseInt(e.target.getAttribute("data-user-id"))
      );
      getModalForm(foundUser);
    });
  });
};

const getModalForm = (foundUser) => {
  const modalForm = document.querySelector(".modal-body").querySelector("form");

  modalForm.userName.value = foundUser.name;
  modalForm.userAge.value = foundUser.age;
  modalForm.userImage.value = foundUser.avatar_url;
  modalForm.userGender.value = foundUser.gender;
  submitBtn.setAttribute("data-user-id", foundUser.id);
};

const updateCard = (user) => {
  const cardsArray = Array.from(document.querySelectorAll(".card"));

  const foundCard = cardsArray.find((card) => {
    return (
      card.querySelector("button").getAttribute("data-user-id") === user.id
    );
  });
  foundCard.innerHTML = `
				<div class="card-image p-3">
					<img src="${user.avatar_url}" alt="${user.name}" height="254px" class="card-img-top object-fit-cover" />
					<span class="card-title">${user.name}</span>
				</div>

				<div class="card-content">
					<ul class="list-group">
						<li class="list-group-item"><strong>Name: </strong>${user.name}</li>
						<li class="list-group-item"><strong>Age: </strong>${user.age}</li>
						<li class="list-group-item"><strong>Gender: </strong>${user.gender}</li>
					</ul>
					<button data-user-id="${user.id}" data-bs-target="#exampleModal" data-bs-toggle="modal" class="edit-btn btn btn-secondary m-2">Edit</button>
				</div>

`;
};

const submitBtn = document.querySelector(".submit-btn");

submitBtn.addEventListener("click", async () => {
  const dataToSend = {
    name: document.querySelector("#userName").value,
    age: document.querySelector("#userAge").value,
    avatar_url: document.querySelector("#userImage").value,
    gender: document.querySelector("#userGender").value,
    id: document.querySelector(".submit-btn").getAttribute("data-user-id"),
  };
  // add spinner
  document.querySelector(".modal-body").innerHTML = `
		<div class="d-flex justify-content-center align-items-center" style="height: 312px;">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
	`;

  try {
    const response = await putData(remoteUrl, dataToSend);

    if (response) {
      document.querySelector(".modal-body").innerHTML = `
		<div class="d-flex justify-content-center align-items-center" style="height: 312px;">
			<div class="alert alert-success" role="alert">
				${response.message}
			</div>
		</div>
		`;
      //console.log(response)
      // dismiss modal
      const myModal = document.getElementById("exampleModal");
      const modal = bootstrap.Modal.getInstance(myModal);

      updateCard(dataToSend); // update the card

      setTimeout(() => {
        modal.hide();
        addEventListeners(); // add the event listener back again !!
      }, 700);
    }
  } catch (error) {
    console.error("Failed to update data:", error);
    document.querySelector(".modal-body").innerHTML = `
		<div class="d-flex flex-column justify-content-center align-items-center" style="height: 312px;">
			<div class="alert alert-danger w-100" role="alert">
				${error.message}
			</div>
			<p class="mark">${error.stack}</p>
		</div>
		`;
  }
});

const loadData = async () => {
  spinner.classList.remove("d-none");
  try {
    console.log("Fetching data...");
    const data = await fetchData(remoteUrl);
    if (data) {
      spinner.classList.add("d-none");
      users = data.data; // set the users variable
      displayUsers(users); // pass users to displayUsers
      addEventListeners();
      // updateCard()
    }
  } catch (error) {
    console.error("Failed to load data:", error.message);
    spinner.classList.add("d-none");
    alert.classList.remove("d-none");
    alert.classList.add("alert-danger");
    alert.innerHTML = `Failed to load data: ${error.message}`;
  }
};

loadData();
