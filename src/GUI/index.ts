let GUI;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default GUI = {
  createGUI() {
    this.GUI = {
      container: document.createElement('div'),
      interact: document.createElement('div'),
      dialoge: document.createElement('div'),
    };
    this.GUI.container.setAttribute('id', 'GUI');
    this.GUI.container.classList.add('GUI');
    document.body.appendChild(this.GUI.container);
    document.getElementById('GUI').appendChild(this.GUI.dialoge);
    document.getElementById('GUI').appendChild(this.GUI.interact);
  },
  createDialogeGUI() {
    this.GUI.dialoge.innerHTML = '';
    this.GUI.dialoge.setAttribute('id', 'dialoge');
    this.GUI.dialoge.classList.add('dialoge');
    this.GUI.dialoge.style.display = 'none';
  },
  createInteractGUI() {
    this.GUI.interact.innerHTML = '';
    this.GUI.interact.setAttribute('id', 'interact');
    this.GUI.interact.classList.add('interact');
    this.GUI.interact.style.display = 'none';
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
    <div class="tip">PRESS Q TO CLOSE</div>
    <div class="tip">PRESS E TO CONTINUE</div>`;
    this.GUI.dialoge.style.display = 'flex';
  },
  closeDialogue() {
    this.GUI.dialoge.style.display = 'none';
  },
  openInteract(text) {
    this.GUI.interact.style.display = 'flex';
    this.GUI.interact.innerHTML = `
      <div class="interact-text">PRESS E TO ${text ?? 'INTERACT'}</div>`;
  },
  closeInteract() {
    this.GUI.interact.style.display = 'none';
  },
};
