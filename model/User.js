"strict mode";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "145OkyayNo668Pass";
//const FILE_PATH = __dirname + "/users.json";
const FILE_PATH = __dirname + "./../data/users.json";

class User {
  constructor(username, email, password, fName, lName, idUser, connected) {
    //TODO modifié et gérer l'utilisateur NOUVEAU et Existant
    this.idUser = idUser;
    //this.idUser = getUserListFromFile(FILE_PATH).length+1;
    this.username = username;
    this.email = email;
    this.password = password;
    this.fName = fName;
    this.lName = lName;
    this.avatar = null;
    this.type = "users";
    this.itemCollections = [];
    this.connected = connected;
  }


  /* return a promise with async / await */ 
  async save() {
    let userList = getUserListFromFile(FILE_PATH);
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    console.log("save:", this.email);
    userList.push({
      idUser: this.idUser,
      username: this.username,
      email: this.email,
      password: hashedPassword,
      fName: this.fName,
      lName: this.lName,
      avatar: this.avatar,
      type: this.type,
      itemCollections: this.itemCollections,
      connected: this.connected
    });
    saveUserListToFile(FILE_PATH, userList);
    return true;
  }

  /* return a promise with classic promise syntax*/
  checkCredentials(username, password) {
    if (!username || !password) return false;
    let userFound = User.getUserFromList(username);
    //console.log("User::checkCredentials:", userFound, " password:", password);
    if (!userFound) return Promise.resolve(false);
    //console.log("checkCredentials:prior to await");
    // return the promise
    return bcrypt
      .compare(password, userFound.password)
      .then((match) => match)
      .catch((err) => err);
  }


  static updateConnection(value, userId){
    updateConnectedField(value, userId, FILE_PATH);
  }
  static getList() {
    let userList = getUserListFromFile(FILE_PATH);
    return userList;
  }

  static isUsername(username) {
    const userFound = User.getUserFromList(username);
    console.log("User::isUser:", userFound);
    return userFound !== undefined;
  }

  static isUserEmail(email){
    const userFound = User.getUserFromListMail(email);
    console.log("User::isUser:", userFound);
    return userFound !== undefined;
  }
  static getUserFromListById(userID) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].idUser == userID) return userList[index];
    }
    return undefined;
  }

  static getUserFromList(username) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index];
    }
    return;
  }

  static getUserId(username){
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index].idUser;
    }
    return -1;
  }

  static getUserFromListMail(email) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].email === email) return userList[index];
    }
    return;
  }
}

function getUserListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) userList = JSON.parse(userListRawData);
  else userList = [];
  return userList;
}

function saveUserListToFile(filePath, userList) {
  const fs = require("fs");
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}
function updateConnectedField(value, userId, filePath){
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) {

    userList = JSON.parse(userListRawData);
  }

  for(let i = 0; i < userList.length; i++){
    if(userList[i].idUser == userId ){
      userList[i].connected = value;
      break;
    }
  }
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}

module.exports = User;
