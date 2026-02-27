# Android Wi-Fi Tethering Bypass (Node.js Proxy)

A lightweight, headless Node.js proxy server designed to run on Termux. It bypasses Android's default kernel-level routing restrictions, allowing you to share an active Wi-Fi connection over USB tethering.

## The Problem

Standard Android behavior restricts sharing a Wi-Fi connection via USB tethering. When USB tethering is enabled, the kernel (`iptables`) routes the USB interface (`rndis0`) toward cellular data and drops packets intended for the Wi-Fi interface (`wlan0`).

## The Solution

Instead of modifying root kernel tables, this project uses an application-layer workaround:

- Run an HTTP/HTTPS proxy server in Termux.
- Point your PC proxy settings to the phone's USB IP.
- Node.js fetches traffic through the phone's active Wi-Fi connection.

## Prerequisites

- Android device
- [Termux](https://termux.dev/) installed on the device
- USB cable
- Connected PC

## Installation

1. Update Termux and install Node.js:

```bash
pkg update && pkg upgrade -y
pkg install nodejs -y
```

2. Create the project directory and file:

```bash
mkdir wifi-proxy && cd wifi-proxy
nano proxy.js
```

3. Paste your proxy logic into `proxy.js`.

## Usage

1. Connect your phone to your PC over USB and enable **USB tethering** in Android settings.

2. In Termux, find the USB bridge IP (look for `rndis0`):

```bash
ifconfig
```

3. Run the server with an auto-restart loop:

```bash
while true; do node proxy.js; sleep 1; done
```

4. On your PC, open system proxy settings and set a manual proxy:

- Host: your phone `rndis0` IP
- Port: `8080`
