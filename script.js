const formInput = document.getElementById("form-input");
const itemInput = document.querySelector(".item-input");
const btnSubmit = document.querySelector(".btn-submit");
const btnRemove = document.querySelector(".btn-remove");
const itemList = document.querySelector(".item-list");
const itemFilter = document.querySelector(".item-filter");
const btnClear = document.getElementById("clear");
let isOnEditMode = false;
let currentItem;

// press on add and item gets added to list

// Functions
function onAdd(e) {
	if (!itemInput.value) {
		alert("Please enter an item");
		return;
	}
	let textInput = itemInput.value.toLocaleLowerCase();

	if (isOnEditMode && currentItem) {
		// Remove selected item from DOM and storage
		removeFromStorageByValue(currentItem.textContent.toLocaleLowerCase());
		currentItem.parentElement.remove();

		// Add to to DOM and storage
		addToDom(textInput);
		addToLocalStorage(textInput);
		resetEditMode();
		checkUi();
		return;
	}

	const itemsFromStorage = getFromLocalStorage();

	if (itemsFromStorage.includes(textInput)) {
		alert("This item already exists");
		itemInput.value = null;
		return;
	}

	addToDom(textInput);
	addToLocalStorage(textInput);
	textInput = null;
	checkUi();
}

// Reset to normal add mode

function resetEditMode() {
	currentItem.classList.remove("color-grey");
	isOnEditMode = false;
	currentItem = null;

	btnSubmit.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
	btnSubmit.style.backgroundColor = "";
	itemInput.value = null;
}

// display items from storage

function displayItems() {
	let itemsFromStorage = getFromLocalStorage();
	if (itemsFromStorage.length > 0) {
		itemsFromStorage.forEach((item) => {
			addToDom(item);
		});
	} else {
		return;
	}
}

function addToDom(item) {
	const listItem = createItem(item);
	itemList.appendChild(listItem);
	checkUi();
}

// Add items to local storage

function addToLocalStorage(item) {
	let itemsFromStorage = getFromLocalStorage();

	// Check if item exists and add item to array
	if (!itemsFromStorage.includes(item.toLowerCase())) {
		itemsFromStorage.push(item);
	}

	// convert to JSON and add to local storage
	localStorage.setItem("listItems", JSON.stringify(itemsFromStorage));
}

// Get items from local storage

function getFromLocalStorage() {
	let itemsFromStorage;

	// Check if there are items in storage

	if (localStorage.getItem("listItems") === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem("listItems"));
	}
	return itemsFromStorage;
}

// Create list item

function createItem(item) {
	const li = document.createElement("li");
	const p = document.createElement("p");
	p.classList.add("item-text");
	p.textContent = item;
	const btn = createButton("btn-remove");
	li.appendChild(p);
	li.appendChild(btn);
	return li;
}

function createButton(classes) {
	const btn = document.createElement("button");
	btn.classList.add(classes);
	const icon = createIcon("fa-solid fa-xmark");
	btn.appendChild(icon);
	return btn;
}

function createIcon(classes) {
	const icon = document.createElement("i");
	icon.className = classes;
	return icon;
}

// Handle clicks on li for remove and edit
function onClick(e) {
	if (e.target.className === "fa-solid fa-xmark") {
		// remove from DOM
		removeItemFromDOM(e.target);
		removeFromStorage(e.target);
	} else if (e.target.textContent === itemInput.value) {
		resetEditMode();
	} else if (e.target.tagName === "P") {
		editItem(e.target);
	} else {
		return;
	}
	checkUi();
}

function editItem(item) {
	itemInput.value = item.textContent;
	btnSubmit.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
	btnSubmit.style.backgroundColor = "green";

	if (currentItem) {
		currentItem.classList.remove("color-grey");
	}

	currentItem = item;
	currentItem.classList.add("color-grey");
	isOnEditMode = true;
}

function removeItemFromDOM(item) {
	// remove from DOM
	item.parentElement.parentElement.remove();
}

function removeFromStorage(item) {
	const textItem = item.parentElement.previousSibling.textContent;
	let itemsFromStorage = getFromLocalStorage();
	if (itemsFromStorage.length === 1) {
		localStorage.clear();
		return;
	}

	itemsFromStorage = itemsFromStorage.filter((i) => i !== textItem);

	localStorage.setItem("listItems", JSON.stringify(itemsFromStorage));
	checkUi();
}

function removeFromStorageByValue(value) {
	let itemsFromStorage = getFromLocalStorage();
	itemsFromStorage = itemsFromStorage.filter((item) => item !== value);
	localStorage.setItem("listItems", JSON.stringify(itemsFromStorage));
}

function checkUi(e) {
	const items = itemList.querySelectorAll("li");

	if (items.length === 0) {
		itemFilter.style.display = "none";
		btnClear.style.display = "none";
	} else {
		itemFilter.style.display = "flex";
		btnClear.style.display = "block";
	}
}

function clearAll(e) {
	const items = itemList.querySelectorAll("li");
	console.log("clicked clear all");
	if (items.length === 0) {
		return;
	} else {
		while (itemList.firstChild) {
			itemList.firstChild.remove();
		}
	}
	localStorage.clear();
	checkUi();
}

function filterItems(e) {
	const text = itemFilter.value.toLowerCase();
	const items = itemList.querySelectorAll("p");

	items.forEach((i) => {
		const itemText = i.textContent.toLocaleLowerCase();

		if (itemText.includes(text)) {
			i.parentElement.style.display = "flex";
		} else {
			i.parentElement.style.display = "none";
		}
	});
}

// Event listeners

document.addEventListener("DOMContentLoaded", displayItems);
formInput.addEventListener("submit", onAdd);
itemList.addEventListener("click", onClick);
document.addEventListener("DOMContentLoaded", checkUi);
btnClear.addEventListener("click", clearAll);
itemFilter.addEventListener("input", filterItems);
