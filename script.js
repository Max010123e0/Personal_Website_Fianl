const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
ctx.fillRect(0, 0, canvas.width, canvas.height);

class HelloWorld extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<p>Hello World!</p>`;
    }
}

customElements.define('hello-world', HelloWorld);