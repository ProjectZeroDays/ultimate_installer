// Mobian configuration - Debian for mobile devices
export const mobianConfig = {
  detection: {
    id: "mobian",
    releaseFile: "/etc/mobian-version",
    osRelease: "ID=mobian",
    phosh: "/usr/bin/phosh",
    pinephone: "/sys/firmware/devicetree/base/model",
  },

  // Debian-based mobile Linux
  base: "Debian",
  target: "Mobile devices",
  interface: "Phosh (GNOME mobile)",

  // Supported devices
  devices: {
    pinephone: "PINE64 PinePhone/Pro",
    librem5: "Purism Librem 5",
    oneplus: "OnePlus 6/6T",
    poco: "Poco F1",
    xiaomi: "Xiaomi Redmi Note 7/9",
    samsung: "Samsung Galaxy S3",
    sony: "Sony Xperia XZ2",
    motorola: "Motorola Moto G4 Play",
  },

  // Package management
  packageManager: {
    name: "apt",
    install: "apt install",
    remove: "apt remove",
    update: "apt update",
    upgrade: "apt upgrade",
  },

  // Mobile stack
  mobile: {
    phosh: "Phone shell (GNOME)",
    phoc: "Compositor",
    squeekboard: "On-screen keyboard",
    calls: "Call application",