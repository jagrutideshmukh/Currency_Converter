const apiKey = "b8ff174bc33dff980c72f4b5"; // Your API key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Fetch exchange rates and update the conversion result
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  
  // Fetch exchange rates from the API
  const URL = `${BASE_URL}${fromCurr.value}`; // Fixed API URL format
  try {
    let response = await fetch(URL);
    let data = await response.json();
    if (data.result === "error") {
      msg.innerText = "Error fetching data. Please try again.";
      return;
    }
    
    let rate = data.conversion_rates[toCurr.value]; // Get the rate for the selected currency
    
    if (!rate) {
      msg.innerText = `Exchange rate not available for ${toCurr.value}.`;
      return;
    }
    
    let finalAmount = (amtVal * rate).toFixed(2); // Round the result to 2 decimal places
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    msg.innerText = "Failed to load exchange rates.";
  }
};

// Update the flag image based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Trigger the currency conversion when the button is clicked
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load the exchange rate when the page is loaded
window.addEventListener("load", () => {
  updateExchangeRate(); // Initially load the default conversion
});