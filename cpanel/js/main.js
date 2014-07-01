function showHide(element) {
	//hide all the elements
	var id = document.getElementById("create");
	id.style.display = 'none';
	id = document.getElementById("edit");
	id.style.display = "none";
	id = document.getElementById("calender");
	id.style.display = "none";
	//show the one we want
	id = document.getElementById(element);
	id.style.display = "block";
}