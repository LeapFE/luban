class TopProgress {
  private progressBar: HTMLDivElement & {
    setCSS?: (style: Partial<CSSStyleDeclaration>) => void;
  };

  private progress: number;

  private timer: number;

  private STEP = 2;

  constructor() {
    this.progress = 0;

    this.progressBar = document.createElement("div");

    this.progressBar.setCSS = (style) => {
      for (const property in style) {
        this.progressBar.style[property] = style[property]!;
      }
    };

    this.timer = 0;

    this.progressBar.setCSS({
      position: "fixed",
      top: "0",
      bottom: "auto",
      left: "0",
      right: "0",
      backgroundColor: "#0a7f9e",
      height: "4px",
      width: "0%",
      zIndex: "999",
      transition: "width " + 0.6 + "s" + ", opacity " + 0.6 * 3 + "s",
    });

    document.body.appendChild(this.progressBar);
  }

  private transit() {
    this.progressBar.style.width = this.progress + "%";
  }

  private hide() {
    this.progressBar.style.opacity = "0";
  }

  private reset() {
    window.clearInterval(this.timer);

    this.progress = 0;
    this.transit();
  }

  private setProgress(progress: number) {
    if (progress > 100) {
      this.progress = 100;
    } else if (progress < 0) {
      this.progress = 0;
    } else {
      this.progress = progress;
    }

    this.transit();
  }

  public show() {
    this.progressBar.style.opacity = "1";

    this.setProgress(this.progress + this.STEP);

    this.timer = window.setInterval(() => {
      this.setProgress(this.progress + this.STEP);
    }, 1000);
  }

  public finish() {
    const that = this;

    window.clearInterval(this.timer);

    this.setProgress(100);
    this.hide();

    if (this.progressBar.style["transition"] !== undefined) {
      this.progressBar.addEventListener("transitionend", function(e) {
        that.reset();

        that.progressBar.removeEventListener(e.type, () => {
          that.finish();
        });
      });
    }
  }
}

export { TopProgress };
