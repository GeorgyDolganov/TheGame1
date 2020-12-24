var GUI;
export default GUI = {
  createGUI() {
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
  },
  createDialogeGUI() {
    this.GUI.dialoge.innerHTML = ``;
    this.GUI.dialoge.setAttribute("id", "dialoge");
    this.GUI.dialoge.classList.add("dialoge");
    this.GUI.dialoge.style.display = "none";
  },
  createInteractGUI() {
    this.GUI.interact.innerHTML = ``;
    this.GUI.interact.setAttribute("id", "interact");
    this.GUI.interact.classList.add("interact");
    this.GUI.interact.style.display = "none";
  },
  openDialoge(name, img, text) {
    this.GUI.dialoge.innerHTML = `
    <div class="border">
      <div class="character">
        <div class="avatar">
          <div class="img" style="background-image: url('${img}')"></div>
        </div>
        <h2>${name}</h2>
      </div>
      <div class="text">
        <p>${text}</p>
      </div>  
    </div>
    <div class="tip">PRESS E TO CLOSE</div>`;
    this.GUI.dialoge.style.display = "flex";
    document.addEventListener('keypress', dialogeListener, false);
    
  },
  _closeDialoge() {
    this.GUI.dialoge.style.display = "none";
    document.removeEventListener('keypress', dialogeListener, false);
  }
}
var dialogeListener = function (event) {
  if (event.key == "e" || event.key == "E" || event.key == "У" || event.key == "у")
  GUI._closeDialoge();
};