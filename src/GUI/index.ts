export function createGUI() {
  this.GUI = {
    container: document.createElement("div"),
    interact: document.createElement("div"),
    dialoge: document.createElement("div")
  };
  this.GUI.container.setAttribute("id", "GUI");
  this.GUI.container.classList.add("GUI");
  document.body.appendChild(this.GUI.container);
  document.getElementById("GUI").appendChild(this.GUI.dialoge);
  document.getElementById("GUI").appendChild(this.GUI.interact);
}

export function createDialogeGUI() {
  this.GUI.dialoge.innerHTML = ``;
  this.GUI.dialoge.setAttribute("id", "dialoge");
  this.GUI.dialoge.classList.add("dialoge");
  this.GUI.dialoge.style.display = "none";
}

export function createInteractGUI() {
  this.GUI.interact.innerHTML = ``;
  this.GUI.interact.setAttribute("id", "interact");
  this.GUI.interact.classList.add("interact");
  this.GUI.interact.style.display = "none";
}
