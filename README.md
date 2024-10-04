### QR Code Generator 

This project demonstrates the creation of a simple Node.js application that generates a QR code based on user input. It uses the following technologies:

- **JavaScript (Node.js)**: Handles user input and generates QR code images.
- **Inquirer.js**: For collecting input from the user.
- **qr-image**: To generate a QR code from the input URL.
- **fs (File System module)**: To save the generated QR code and store the URL in a text file.

### Functionality:
1. The application prompts the user to enter a URL.
2. It generates a QR code image from the input URL using the `qr-image` package.
3. It saves the QR code as a `.png` file and stores the URL in a text file.
