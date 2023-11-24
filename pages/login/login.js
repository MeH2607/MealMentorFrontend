import { API_URL } from "../../settings.js"
//const API_URL = "http://localhost:8080/api/"

export async function initLogin() {
    document.getElementById("login-btn").onclick = login;
    document.getElementById("login-message").innerText = ""
    
    const usernameInput = document.getElementById("username-input")
    const passwordInput = document.getElementById("password-input")
    
    const token = localStorage.getItem("token")
    
    async function handleHttpErrors(res) {
        if (!res.ok) {
            const errorResponse = await res.json();
            const error = new Error(errorResponse.message)
            // @ts-ignore
            error.apiError = errorResponse
            throw error
        }
        return res.json()
    }
    
    async function login(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    
        const loginRequest = {}
        // @ts-ignore
        loginRequest.username = usernameInput.value
        // @ts-ignore
        loginRequest.password = passwordInput.value
    
        const options = {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(loginRequest)
        }
    
        try {
            const response = await fetch(API_URL + "/auth/login", options).then(handleHttpErrors)
            storeLoginDetails(response)
        } catch (error) {
            console.log(error)
        }

        if (localStorage.getItem("token") !== null) {
            // @ts-ignore
            usernameInput.value = ""
            // @ts-ignore
            passwordInput.value = ""
            document.getElementById("login-message").innerText = "You are now logged in to: " + localStorage.getItem("user")
        }
        else {
            document.getElementById("login-message").innerText = "Login failed"
        }
    }
    
    /**
    * Store username, roles and token in localStorage, and update UI-status
    * @param res - Response object with details provided by server for a succesful login
    */
    function storeLoginDetails(res) {
        localStorage.setItem("token", res.token)
        localStorage.setItem("user", res.username)
        localStorage.setItem("roles", res.roles)

        toggleUiBasedOnRoles(true);
    }
     function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("roles")
        toggleUiBasedOnRoles(false)
      }
}


export function toggleUiBasedOnRoles(loggedIn) {
  
    const loginContainer = document.getElementById("login-container");
    const logoutContainer = document.getElementById("logout-container");
    const mealplanContainer = document.getElementById("mealplan-container");
    const userSettingsContainer = document.getElementById("userSettings-container");

    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles");


   // console.log("Roles: ", roles)
    console.log("token: ", token)
    

    // Visibility
    logoutContainer.style.display = "block"
    loginContainer.style.display = "none"
    mealplanContainer.style.display = "none"
     if(loggedIn) {
      
      logoutContainer.style.display = "block"
      loginContainer.style.display = "none"
      mealplanContainer.style.display = "block"
      userSettingsContainer.style.display = "block"
    
      
    }
    
      else {
        logoutContainer.style.display = "none"
        loginContainer.style.display = "block"
        mealplanContainer.style.display = "none"
        userSettingsContainer.style.display = "none"
      }
      

    }