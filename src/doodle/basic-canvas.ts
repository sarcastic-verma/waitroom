import { DoodlePlugin, DoodleInstance, DoodleConfig } from "../core/types";

class CanvasInstance implements DoodleInstance {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: DoodleConfig;
  private isDrawing = false;

  constructor(container: HTMLElement, config?: DoodleConfig) {
    this.container = container;
    this.config = config || {};

    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "center";

    this.canvas = document.createElement("canvas");
    this.canvas.style.border = "1px solid #ccc";
    this.canvas.style.width = "90%";
    this.canvas.style.flex = "1"; // Fill available space
    this.canvas.style.minHeight = "0";
    this.canvas.style.background = "#fff";

    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d")!;

    // Resize observer
    const observer = new ResizeObserver(() => this.resize());
    observer.observe(this.canvas);

    // Wait for layout
    setTimeout(() => this.resize(), 0);

    this.setupEvents();

    // Clear Button
    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    clearBtn.style.marginTop = "10px";
    clearBtn.style.padding = "5px 10px";
    clearBtn.style.cursor = "pointer";
    clearBtn.style.border = "1px solid #ccc";
    clearBtn.style.borderRadius = "4px";
    clearBtn.style.backgroundColor = "#fff";
    clearBtn.onclick = () => this.clear();

    // Add hover effect
    clearBtn.onmouseenter = () => (clearBtn.style.backgroundColor = "#f0f0f0");
    clearBtn.onmouseleave = () => (clearBtn.style.backgroundColor = "#fff");

    this.container.appendChild(clearBtn);
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    // Only resize if dimensions changed to avoid clearing
    if (
      this.canvas.width !== rect.width ||
      this.canvas.height !== rect.height
    ) {
      // Save content
      const data = this.canvas.toDataURL();

      this.canvas.width = rect.width;
      this.canvas.height = rect.height;

      // Restore styling
      this.ctx.lineCap = "round";
      this.setBrushSize(this.config.defaultBrushSize || 3);
      this.setBrushColor(this.config.defaultColor || "#000");

      // Restore content
      const img = new Image();
      img.onload = () => this.ctx.drawImage(img, 0, 0);
      img.src = data;
    }
  }

  private setupEvents() {
    this.canvas.addEventListener("mousedown", this.start.bind(this));
    this.canvas.addEventListener("mousemove", this.draw.bind(this));
    this.canvas.addEventListener("mouseup", this.stop.bind(this));
    this.canvas.addEventListener("mouseout", this.stop.bind(this));
  }

  private start(e: MouseEvent) {
    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(e.offsetX, e.offsetY);
  }

  private draw(e: MouseEvent) {
    if (!this.isDrawing) return;
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
  }

  private stop() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.ctx.closePath();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  undo() {}
  redo() {}
  async save() {
    return this.canvas.toDataURL();
  }
  load(url: string) {
    const img = new Image();
    img.onload = () => this.ctx.drawImage(img, 0, 0);
    img.src = url;
  }

  setBrushColor(color: string) {
    this.ctx.strokeStyle = color;
  }
  setBrushSize(size: number) {
    this.ctx.lineWidth = size;
  }

  destroy() {
    this.container.innerHTML = "";
  }
}

export const BasicDoodle: DoodlePlugin = {
  id: "basic-doodle",
  name: "Basic Doodle",
  renderMini: (c, cfg) => new CanvasInstance(c, cfg),
  renderFull: (c, cfg) => new CanvasInstance(c, cfg),
};
