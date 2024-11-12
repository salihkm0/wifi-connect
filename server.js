// const express = require("express");
// const wifi = require("node-wifi");

// const app = express();
// app.use(express.json());

// // Configuration
// const TARGET_SSID = "wifi_1";
// const PASSWORD = "abcd1234";
// const SCAN_INTERVAL = 30000; // 30 seconds

// // Initialize wifi with the network interface
// wifi.init({
//   iface: "wlan0",
//   //   iface: "en0" // Replace with your network interface if needed, or leave as null for automatic detection
// });

// // Function to scan and connect to the target network
// async function scanAndConnect() {
//   try {
//     console.log(`Scanning for available networks...`);
//     const networks = await wifi.scan();
//     console.log("Detected Networks:", networks); // Log detected networks

//     const targetNetwork = networks.find(
//       (network) => network.ssid === TARGET_SSID
//     );

//     if (targetNetwork) {
//       console.log(`Network "${TARGET_SSID}" found. Attempting to connect...`);
//       try {
//         await wifi.connect({ ssid: TARGET_SSID, password: PASSWORD });
//         console.log(`WiFi connected to "${TARGET_SSID}"`);
//       } catch (error) {
//         console.log(
//           `Failed to connect. WiFi password might be incorrect for "${TARGET_SSID}".
//             Please Change Your wifi Password to ${PASSWORD}
//           `
//         );
//       }
//     } else {
//       console.log(
//         `Network "${TARGET_SSID}" not found.Please Create a wifi with ssid : ${TARGET_SSID} and Password : ${PASSWORD}. Will retry in ${
//           SCAN_INTERVAL / 1000
//         } seconds.`
//       );
//       setTimeout(scanAndConnect, SCAN_INTERVAL);
//     }
//   } catch (error) {
//     console.error("Error scanning for networks:", error);
//     setTimeout(scanAndConnect, SCAN_INTERVAL);
//   }
// }

// // Start scanning and connecting
// scanAndConnect();

// // Start the server and log current connections
// app.listen(3001, () => {
//   console.log(`✔ Server running on port 3001`);
// });

const express = require("express");
const wifi = require("node-wifi");

const app = express();
app.use(express.json());

// Configuration
const TARGET_SSID = "wifi_1";
const PASSWORD = "abcd1234";
const SCAN_INTERVAL = 30000; // 30 seconds

// Initialize wifi with the network interface
wifi.init({
  iface: "wlan0", // Ensure this matches your Wi-Fi interface
});

// Function to check current connection status
async function checkConnection() {
  try {
    const currentConnections = await wifi.getCurrentConnections();
    const connected = currentConnections.some(
      (connection) => connection.ssid === TARGET_SSID
    );

    if (connected) {
      console.log(`✔ Already connected to "${TARGET_SSID}"`);
    } else {
      console.log(`✖ Not connected to "${TARGET_SSID}". Starting scan...`);
      scanAndConnect();
    }
  } catch (error) {
    console.error("Error checking current connection:", error);
    scanAndConnect();
  }
}

// Function to scan and connect to the target network
async function scanAndConnect() {
  try {
    console.log(`Scanning for available networks...`);
    const networks = await wifi.scan();
    console.log("Detected Networks:", networks); // Log detected networks

    const targetNetwork = networks.find(
      (network) => network.ssid === TARGET_SSID
    );

    if (targetNetwork) {
      console.log(`Network "${TARGET_SSID}" found. Attempting to connect...`);
      try {
        await wifi.connect({ ssid: TARGET_SSID, password: PASSWORD });
        console.log(`WiFi connected to "${TARGET_SSID}"`);
      } catch (error) {
        console.log(
          `Failed to connect. Retrying connection in ${
            SCAN_INTERVAL / 1000
          } seconds. Please ensure the password is correct.`
        );
        setTimeout(scanAndConnect, SCAN_INTERVAL); // Retry connection after SCAN_INTERVAL
      }
    } else {
      console.log(
        `Network "${TARGET_SSID}" not found. Retrying scan in ${
          SCAN_INTERVAL / 1000
        } seconds.`
      );
      setTimeout(scanAndConnect, SCAN_INTERVAL);
    }
  } catch (error) {
    console.error("Error scanning for networks:", error);
    setTimeout(scanAndConnect, SCAN_INTERVAL);
  }
}

// Start by checking the connection status
checkConnection();

// Start the server and log current connections
app.listen(3001, () => {
  console.log(`✔ Server running on port 3001`);
});
