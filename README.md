# homebridge-xiaomi-roborock-vacuum (Localized Version)

**Note:** This is a localized version. The original project source with full documentation can be found at: [homebridge-xiaomi-roborock-vacuum](https://github.com/homebridge-xiaomi-roborock-vacuum/homebridge-xiaomi-roborock-vacuum).

This working copy is customized and pre-built for Node.js 24+, specifically tailored for easy installation on a Raspberry Pi running Homebridge.

## Installation on Raspberry Pi

The easiest way to install this plugin is via the `hb-service` command, which ensures that it is properly registered with your Homebridge UI.

1. Open your Homebridge UI and launch the **Terminal** (or connect to your Raspberry Pi via SSH).
2. Run the following installation command:

```bash
sudo hb-service add https://raw.githubusercontent.com/ozturkergin/homebridge-roborock/main/homebridge-roborock-ergin-1.0.0.tgz
```

3. Once the installation is complete, **restart Homebridge** for the changes to take effect.

## Configuration

For complete configuration instructions, including how to find your vacuum's IP address and token, please refer to the [original documentation](https://github.com/homebridge-xiaomi-roborock-vacuum/homebridge-xiaomi-roborock-vacuum#instructions).
