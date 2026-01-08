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
    clearBtn.innerText = "Clear Canvas";
    clearBtn.style.marginTop = "15px";
    clearBtn.style.padding = "8px 16px";
    clearBtn.style.cursor = "pointer";
    clearBtn.style.border = "none";
    clearBtn.style.borderRadius = "20px";
    clearBtn.style.backgroundColor = "#e2e8f0";
    clearBtn.style.color = "#475569";
    clearBtn.style.fontWeight = "600";
    clearBtn.style.fontSize = "0.9rem";
    clearBtn.style.transition = "all 0.2s ease";
    clearBtn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";

    clearBtn.onclick = () => this.clear();

    // Add hover effect
    clearBtn.onmouseenter = () => {
      clearBtn.style.backgroundColor = "#cbd5e1";
      clearBtn.style.transform = "translateY(-1px)";
    };
    clearBtn.onmouseleave = () => {
      clearBtn.style.backgroundColor = "#e2e8f0";
      clearBtn.style.transform = "translateY(0)";
    };

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

    // Touch support
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.start({
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      } as any);
    });
    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.draw({
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      } as any);
    });
    this.canvas.addEventListener("touchend", this.stop.bind(this));
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
