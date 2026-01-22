# Sparrow

**Available For**

- StartOS
- Mac
- Linux
- Windows

**Contents**

- [Using Sparrow on StartOS](#sparrow-on-startos)
- [Using Sparrow Desktop App](#sparrow-desktop)

**Instructions**

## Sparrow on StartOS

TIP: To choose between a connection to Bitcoin Core/Knots or to Electrs, instead of using the Sparrow's own UI you will instead set your choice in the StartOS UI at `Services > Sparrow > Actions`

NOTE: You cannot connect hardware signing devices (wallets) to your server, they will not be detected by Sparrow.

1. Ensure Sparrow is installed and running if not already.

1. Click "Launch UI".

## Sparrow Desktop

1. If this is your first time using Sparrow, you will be guided to a screen to configure your Bitcoin or electrs server. Otherwise, you can find the server setup in `File > Preferences > Server > Configure Server`.

   - **Connecting to Electrs**:

      1. In the `URL` field, enter your preferred electrs hostname and port (found in `Services > Electrs` then the Interfaces section).

      1. Test your connection


      **Note:** Tor Users only:
      
      If you are connecting over Tor set up as a [local Proxy](https://staging.docs.start9.com/user-manual/connecting-remotely/tor.html) …

        - Enable `Use Proxy`.
        - For `URL`, enter "localhost".
        - For `Port`, enter "9050".

      Otherwise, if you are using Sparrow's own Tor daemon, keep `Use Proxy` disabled.


   - **Connecting to Bitcoin**:

      To connect to Bitcoin Core, see the Bitcoin Core [documentation](https://github.com/Start9Labs/bitcoind-startos/docs/instructions.md)
      To connect to Bitcoin Knots, see the Bitcoin Knots [documentation](https://github.com/Start9Labs/bitcoin-knots-startos/docs/instructions.md)