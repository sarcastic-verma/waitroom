// Minimal Portal helper logic
// In a framework-agnostic way, this would manage creating a fixed overlay
// and transferring the state/rendering to it.

export class PortalSystem {
  private overlay: HTMLElement | null = null;

  constructor() {}

  open(contentRenderer: (container: HTMLElement) => void, onClose: () => void) {
    if (this.overlay) return;

    this.overlay = document.createElement("div");
    this.overlay.style.position = "fixed";
    this.overlay.style.top = "0";
    this.overlay.style.left = "0";
    this.overlay.style.width = "100vw";
    this.overlay.style.height = "100vh";
    this.overlay.style.backgroundColor = "rgba(0,0,0,0.85)";
    this.overlay.style.zIndex = "9999";
    this.overlay.style.display = "flex";
    this.overlay.style.justifyContent = "center";
    this.overlay.style.alignItems = "center";
    this.overlay.style.color = "white";

    const contentContainer = document.createElement("div");
    contentContainer.style.width = "80%";
    contentContainer.style.height = "80%";
    contentContainer.style.position = "relative";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "×";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "-40px";
    closeBtn.style.right = "0";
    closeBtn.style.fontSize = "30px";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "white";
    closeBtn.style.cursor = "pointer";

    closeBtn.onclick = () => {
      this.close();
      onClose();
    };

    this.overlay.appendChild(closeBtn);
    this.overlay.appendChild(contentContainer);
    document.body.appendChild(this.overlay);

    // Render content
    contentRenderer(contentContainer);
  }

  close() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
    }
  }
}
