export default class SelectElement extends HTMLElement {
  constructor() {
    super();

    this.button = this.querySelector('[data-button="select"]');
    this.dropdown = this.querySelector("[data-listbox]");
    this.options = this.querySelectorAll('[role="option"]');
    this.isRequired = this.hasAttribute("data-required");
    this.isDeactivated = this.hasAttribute("data-deactivated");
    this.isDropdownOpen = false;
    this.currentOptionIndex = 0;

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleDocumentInteraction = this.handleDocumentInteraction.bind(this);
    this.moveFocusDown = this.moveFocusDown.bind(this);
    this.moveFocusUp = this.moveFocusUp.bind(this);
    this.selectCurrentOption = this.selectCurrentOption.bind(this);
    this.focusCurrentOption = this.focusCurrentOption.bind(this);
    this.selectOptionByElement = this.selectOptionByElement.bind(this);
  }

  connectedCallback() {
    if (this.button && this.dropdown) {
      this.button.addEventListener("keydown", this.handleKeyPress);
      this.button.addEventListener("click", this.handleButtonClick);
      document.addEventListener("click", (event) =>
        this.handleDocumentInteraction(event)
      );
      this.applyRequiredStyles();
      if (this.isDeactivated) {
        this.button.classList.add("deactivated");
      }
    }
  }

  applyRequiredStyles() {
    if (this.isRequired && !this.hasSelectedValue()) {
      this.button.classList.add("required");
    } else {
      this.button.classList.remove("required");
    }
  }

  disconnectedCallback() {
    if (this.button) {
      this.button.removeEventListener("keydown", this.handleKeyPress);
      this.button.removeEventListener("click", this.handleButtonClick);
    }
    document.removeEventListener("click", (event) =>
      this.handleDocumentInteraction(event)
    );
  }

  focusCurrentOption() {
    const currentOption = this.options[this.currentOptionIndex];
    currentOption.classList.add("current");
    currentOption.focus();

    currentOption.scrollIntoView({
      block: "nearest",
    });

    this.options.forEach((option, index) => {
      if (option !== currentOption) {
        option.classList.remove("current");
      }
    });
  }

  moveFocusDown() {
    if (this.currentOptionIndex < this.options.length - 1) {
      this.currentOptionIndex++;
    } else {
      this.currentOptionIndex = 0;
    }
    this.focusCurrentOption();
  }

  moveFocusUp() {
    if (this.currentOptionIndex > 0) {
      this.currentOptionIndex--;
    } else {
      this.currentOptionIndex = this.options.length - 1;
    }
    this.focusCurrentOption();
  }

  selectCurrentOption() {
    const selectedOption = this.options[this.currentOptionIndex];
    this.selectOptionByElement(selectedOption);
  }

  hasSelectedValue() {
    const buttonTextElement = this.button.querySelector(
      '[data-text="buttonText"]'
    );
    return buttonTextElement && buttonTextElement.textContent !== "Select";
  }

  setDeactivated(isDeactivated) {
    this.isDeactivated = isDeactivated;
    if (this.isDeactivated) {
      this.button.classList.add("deactivated");
    } else {
      this.button.classList.remove("deactivated");
    }
  }

  selectOptionByElement(optionElement) {
    const optionValue = optionElement.textContent;
    const buttonTextElement = this.button.querySelector(
      '[data-text="buttonText"]'
    );
    const selectInputElement = this.querySelector("[data-custom-select-value]");

    if (buttonTextElement) {
      buttonTextElement.textContent = optionValue;
    }

    if (selectInputElement) {
      selectInputElement.value = optionValue;
    }

    this.button.classList.toggle("selected");

    this.options.forEach((option) => {
      option.classList.remove("active");
      option.setAttribute("aria-selected", "false");
    });

    optionElement.classList.add("active");
    optionElement.setAttribute("aria-selected", "true");

    this.toggleDropdown();
    this.applyRequiredStyles();
  }

  handleButtonClick(event) {
    this.toggleDropdown();
    event.stopPropagation();
  }

  toggleDropdown() {
    if (!this.dropdown || !this.button) {
      return;
    }

    this.dropdown.classList.toggle("active");
    this.isDropdownOpen = !this.isDropdownOpen;
    this.button.setAttribute("aria-expanded", this.isDropdownOpen.toString());

    const iconElement = this.button.querySelector(".icon-select");
    if (iconElement) {
      iconElement.classList.toggle("icon-rotate", this.isDropdownOpen);
    }

    if (this.isDropdownOpen) {
      this.button.classList.remove("selected");
    }
  }

  handleKeyPress(event) {
    const { key } = event;
    const openKeys = ["ArrowDown", "ArrowUp", "Enter", " "];

    if (!this.isDropdownOpen && openKeys.includes(key)) {
      event.preventDefault();
      this.toggleDropdown();
    } else if (this.isDropdownOpen) {
      switch (key) {
        case "Escape":
          this.toggleDropdown();
          break;
        case "ArrowDown":
          this.moveFocusDown();
          break;
        case "ArrowUp":
          this.moveFocusUp();
          break;
        case "Enter":
          event.preventDefault();
          event.stopPropagation();
          this.selectCurrentOption();

          break;
        case " ":
          this.selectCurrentOption();
          break;
        default:
          break;
      }
    }
  }

  handleDocumentInteraction(event) {
    const isClickInsideComponent = this.contains(event.target);

    if (!isClickInsideComponent && this.isDropdownOpen) {
      this.toggleDropdown();
    } else if (isClickInsideComponent) {
      const clickedOption = event.target.closest('[role="option"]');
      if (clickedOption) {
        this.selectOptionByElement(clickedOption);
      } else if (this.button.contains(event.target) && this.isDropdownOpen) {
        this.toggleDropdown();
      }
    }
  }
}
