// KDE Plasma Mobile configuration
export const plasmamobileConfig = {
  detection: {
    id: "plasma-mobile",
    desktopSession: "plasma-mobile",
    kwin: "/usr/bin/kwin_wayland",
    plasmaPhoneComponents: "/usr/share/plasma-phone-components",
  },

  // KDE's mobile interface
  base: "KDE Plasma",
  shell: "plasmashell (mobile)",
  compositor: "KWin (Wayland)",
  displayServer: "Wayland only",

  // Based on distribution
  distributions: {
    postmarketos: "postmarketOS (primary)",
    manjaro: "Manjaro ARM",
    arch: "Arch Linux ARM",
    debian: "Debian mobile",
    fedora: "Fedora Mobility",
    opensuse: "openSUSE",
  },

  // Package management (depends on base)
  packageManager: {
    varies: "Depends on base distribution",
    recommended: "postmarketOS (Alpine-based)",
  },

  // Core components
  components: {
    shell: "plasma-mobile",
    workspace: "plasma-workspace",
    phoneComponents: "plasma-phone-components",
    settings: "plasma-settings",
    angelfish: "Angelfish (web browser)",
    index: "Index (file manager)",
    spacebar: "Spacebar (SMS)",
    phone: "Plasma Dialer",
    okular: "Okular Mobile",
    peruse: "Peruse (comics)",
    calindori: "Calindori (calendar)",
    koko: "Koko (images)",
    vvave: "VVave (music)",
  },

  // Framework
  framework: {
    qt: "Qt6 (transitioning from Qt5)",
    kirigami: "Kirigami (adaptive UI)",
    plasma: "Plasma Framework",
    kdeclarative: "KDeclarative",
  },

  // Input
  input: {
    touch: true,
    gesture: true,
    onScreenKeyboard: "maliit-keyboard",
    virtualKeyboard: true,
  },

  // Development
  development: {
    kirigami: "Kirigami for adaptive apps",
    qml: "QML for UI",
    cmake: "CMake build system",
    nightlyRepo: "Available for testing",
  },

  // Features
  features: {
    convergence: true, // Same code base as desktop Plasma
    adaptive: true,
    wayland: true,
    xwayland: false, // Limited X11 support
    librem5: "Supported",
    pinephone: "Supported",
  },
};

export default plasmamobileConfig;