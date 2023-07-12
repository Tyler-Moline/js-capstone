let unchangingArray = [];
let nameArray = [];
let lengthOfArray;

// This is authenticating with the API and the login information
const email = "tmoline@devpipeline.com"; //will be provided in the moodle
const pass = "One2threesf@1";
let resObject;
const userData = {
  email: email,
  password: pass,
};
async function auth() {
  try {
    const res = await fetch("https://api.devpipeline.org/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const resObject = await res.json();
    const authToken = resObject.auth_info.auth_token;
    return authToken;
  } catch (error) {
    console.error("Error: ", error);
  }
}

// This is getting all the info from the API and drilling into it and putting it into the nameArray
async function getAll() {
  try {
    const getAuth = await auth();
    const res = await fetch("https://api.devpipeline.org/users", {
      headers: { auth_token: getAuth },
    });
    const allUsers = await res.json();
    resObject = allUsers.users;
  } catch (error) {
    console.error("Error: ", error);
  }
  for (i = 0; i < resObject.length; i++) {
    unchangingArray.push(
      `${resObject[i].first_name} ${resObject[i].last_name}`
    );
  }
  nameArray = unchangingArray;
  lengthOfArray = nameArray.length;
}

async function nameFlipper() {
  function delay() {
    return new Promise((resolve) =>
      setTimeout(() => {
        const randomN =
          unchangingArray[Math.floor(Math.random() * unchangingArray.length)];
        resolve((selectedName.textContent = randomN));
      }, 150)
    );
  }
  for (let i = 0; i < 10; i++) {
    await delay();
  }
}

// This is the function that populates the left list and sets the event
// listeners for the plus and minus buttons
function populateNames() {
  getAll().then(() => {
    for (let i = 0; i < nameArray.length; i++) {
      const name = document.createElement("h1");
      const personWrapper = document.createElement("div");
      const bottomBtnWrapper = document.createElement("div");
      const plusBtn = document.createElement("button");
      const minusBtn = document.createElement("button");
      let count = 1;
      let counter = document.createElement("span");

      counter.id = "counter";
      plusBtn.id = "plus";
      minusBtn.id = "minus";
      personWrapper.id = `${nameArray[i]}Div`;
      personWrapper.classList.add("person-div");

      count = 1;
      counter.textContent = count;
      plusBtn.textContent = "+";
      minusBtn.textContent = "-";

      name.textContent = nameArray[i];
      let currentName = nameArray[i];

      leftColumn.appendChild(personWrapper);
      personWrapper.appendChild(name);
      personWrapper.appendChild(bottomBtnWrapper);
      bottomBtnWrapper.appendChild(minusBtn);
      bottomBtnWrapper.appendChild(counter);
      bottomBtnWrapper.appendChild(plusBtn);

      plusBtn.addEventListener("click", () => {
        count += 1;
        counter.textContent = count;
        console.log(nameArray[i]);
        nameArray.push(nameArray[i]);
      });

      minusBtn.addEventListener("click", () => {
        if (count > 1) {
          count -= 1;
          counter.textContent = count;
          console.log(lengthOfArray);
          for (let i = lengthOfArray; nameArray.length > lengthOfArray; i++) {
            if (nameArray[i] === currentName) {
              nameArray.splice(i, 1);
              i -= 1;
              break;
            }
          }
        }
      });
    }
  });
}

// This gets a random name from the nameArray then removes one instance of that name so it cant
// be chosen again. once the array is empty it populates it again
function getRandomName() {
  if (nameArray.length === 0) {
    getAll();
    selectedName.textContent = "You've selected all students, lets start again";
    for (let i of counter) {
      i.innerText = 1;
    }
  } else {
    nameFlipper().then(() => {
      const randomName =
        nameArray[Math.floor(Math.random() * nameArray.length)];
      let nameIndex = nameArray.indexOf(randomName);

      selectedName.textContent = randomName;
      let currentPerson = document.getElementById(`${randomName}Div`);
      let currentCount = currentPerson.children[1].children[1];
      parseInt((currentCount.textContent -= 1));
      randomName.counter -= nameArray.splice(nameIndex, 1);
    });
  }
}

populateNames();
btn.onclick = () => getRandomName();
