const formInput = document.getElementById("form-input");
const itemInput = document.querySelector(".item-input");
const btnSubmit = document.querySelector(".btn-submit");
const btnRemove = document.querySelector(".btn-remove");
const itemList = document.querySelector(".item-list");
const itemFilter = document.querySelector(".item-filter");
const btnClear = document.getElementById("clear");
// press on add and item gets added to list

function addItem(e) {
	e.preventDefault();
	if (!itemInput.value) {
		alert("Please enter an item");
		return;
	}

	const listItem = createItem(itemInput.value);
	itemList.appendChild(listItem);
	itemInput.value = null;
	checkUi();
}

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

function removeItem(e) {
	if (e.target.className === "fa-solid fa-xmark") {
		e.target.parentElement.parentElement.remove();
	}
	checkUi();
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
	checkUi();
}

// function filterItems() {
// 	const items = itemList.querySelectorAll("p");
// 	items.forEach((i) => {
// 		if
// 	});
// }

// Event listeners

formInput.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem);
document.addEventListener("DOMContentLoaded", checkUi);
btnClear.addEventListener("click", clearAll);
// itemFilter.addEventListener("input", filterItems);
