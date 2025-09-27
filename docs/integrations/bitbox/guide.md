# BitBox

**Available For**

- Linux
- macOS
- Windows
- Android
- iOS


**Contents**

1. First, if you plan to user Tor, go to `Settings > Advanced settings` and click "Enable Tor Proxy", then enter "127.0.0.1:9050" as the address, then click "Set Proxy Address"

   **Note:** Your proxy port may be different depending on how you [set up TOR](https://docs.start9.com/user-manual/connecting-remotely/tor.html) on your device. If you are on a mobile OS, you will need to download and run [Orbot-Tor VPN](https://orbot.app/en/).

1. Back out and click on `Connect your own full node`.

   **Note:** You may wish to remove the default servers.

1. Under `Add a server` enter your preferred electrs hostname and port (found in `Services > Electrs` then the Interfaces section). Click "Check" to test. If you get an error, restart the app (Tor has not connected) and repeat this step.

1. Click "Add" to finalize the addition of your node to BitBox. You will then see it under the list of servers above.

1. Restart the app and you're ready to use BitBox.
