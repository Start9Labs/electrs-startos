# Trezor Suite

**Available For**

- Mac
- Linux
- Windows
- Android

**Contents**

1. Open Trezor and click on the gear icon in the left hand menu to enter the Settings.

1. On the following screen, select "Assets" from the tab/submenu.

1. On this screen, hover over Bitcoin to show the gear icon, then click on that icon to enter Bitcoin's Settings menu.

1. Under "Bitcoin Backends" that has now popped up, click the dropdown menu to change from `Trezor servers (default)` to `Custom Electrum Server`.

1. In the field below, you will enter your preferred electrs hostname and port (found in `Services > Electrs` then the Interfaces section) in a **specific format**.

   Format: `host:port:protocol`

   To build your connection string, 

   - First add your prefered `host:post` from the interfaces section. This may be a Local, IPv4, Tor or even a custom domain.
   - Then add `:s` for SSL
   - Your final string might look like: `192.168.0.21:49195:s` or `adjective-noun.local:49195:s` or `mydomain.xyz`

1. If you have not already enabled Tor in the Trezor settings, you will be asked to do so now. Click "Enable Tor and Confirm," and that's it! You're now using StartOS's Bitcoin node with your Trezor Suite!