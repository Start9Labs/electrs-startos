# Foundation Envoy 

**Available For**

- Android
- iOS


**Contents**

1. Select the Privacy shield icon at the bottom of the app.

1. Look for the `Node` section and change "Foundation (Default)" to "Personal Node".
 
1. Below that, enter your preferred electrs hostname and port (found in `Services > Electrs` then the Interfaces section) in a **specific format**.

    Format: `protocol://host:port`

    To build your connection string, 

    - First simply type `ssl://` if you're not going to use Tor, or `tcp://` if you are.
    - Then add your prefered `host:post` from the interfaces section. This may be a Local, IPv4, Tor or even a custom domain (or Tor domain).
    - Your final string might look like: `ssl://192.168.0.21:49195` or `ssl://adjective-noun.local:49195` or `ssl://mydomain.xyz`

1. It should show bellow the address field if the connection was successful or not.