// select the toggle button
const toggleBtn = document.querySelector(".header__toggle-btn")
// select the header
const header = document.querySelector(".header")

toggleBtn.addEventListener("click", () => {
	header.classList.toggle("header-open");

	//console.log("run the function here !!");
})
