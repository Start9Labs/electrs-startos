# Electrum 

**Available For**

- Mac
- Linux
- Windows
- Android

**Contents**

1. Open Electrum and go to "Tools -> Network".

1. For `Connection mode`, select "Connect only to a single server" to make sure that Electrum only connects to your own server.

1. In `Server`, enter your preferred electrs `hostname` and `port` (found in `Services > Electrs` then the Interfaces section) then append this with `:t`. For example: `adjective-noun.local:49195:t`

   Note: If you are using a Tor interface, switch to the "Proxy" tab select "Use Tor" and "Use Proxy" and enter "127.0.0.1" for the address and 9050 for the port. Click "Next."

1. That's it! You will be prompted to create a wallet if this is your first time. You can check your connection by clicking the orb in the bottom right, which should be blue in color.