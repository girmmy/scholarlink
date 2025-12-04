[![Netlify Status](https://api.netlify.com/api/v1/badges/138633e1-f9ba-4211-bf79-8850390f2e21/deploy-status)](https://app.netlify.com/projects/thescholarlink/deploys)

# ScholarLink

A web application for discovering and managing scholarship opportunities.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Node.js and npm

This project requires **Node.js** (version 14 or higher recommended) and **npm** (Node Package Manager), which comes bundled with Node.js.

#### Installing Node.js and npm

**Option 1: Download from Official Website (Recommended)**

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version for your operating system
3. Run the installer and follow the installation wizard
4. Verify installation by opening a terminal/command prompt and running:
   ```bash
   node --version
   npm --version
   ```

**Option 2: Using a Package Manager**

- **macOS (using Homebrew):**

  ```bash
  brew install node
  ```

- **Linux (Ubuntu/Debian):**

  ```bash
  sudo apt update
  sudo apt install nodejs npm
  ```

- **Windows (using Chocolatey):**
  ```bash
  choco install nodejs
  ```

## Getting Started

### 1. Clone the Repository

Clone this repository to your local machine using one of the following methods:

**Using HTTPS:**

```bash
git clone https://github.com/yourusername/scholarlink.git
```

**Using SSH:**

```bash
git clone git@github.com:yourusername/scholarlink.git
```

**Using GitHub CLI:**

```bash
gh repo clone yourusername/scholarlink
```

### 2. Navigate to Project Directory

```bash
cd scholarlink
```

### 3. Install Dependencies

Install all required packages and dependencies:

```bash
npm install
```

or using the shorthand:

```bash
npm i
```

This command will:

- Read the `package.json` file
- Download and install all dependencies listed in `dependencies` and `devDependencies`
- Create a `node_modules` folder with all the installed packages

**Note:** The first installation may take a few minutes depending on your internet connection.

### 4. Start the Development Server

Once dependencies are installed, start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is occupied). The terminal will display the exact URL.

The development server includes:

- Hot Module Replacement (HMR) - changes reflect immediately
- Fast refresh for React components
- Error overlay in the browser

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Starts the development server with Vite. The app will automatically reload when you make changes to the code.

### `npm run build`

Creates an optimized production build of the app in the `build` folder. This build is minified and ready for deployment.

### `npm run preview`

Serves the production build locally so you can preview how it will look when deployed.

### `npm test`

Launches the test runner in interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Project Structure

```
scholarlink/
├── public/              # Static assets
│   ├── data/           # JSON data files
│   └── ...
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── assets/         # Images and other assets
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Application entry point
├── package.json        # Project dependencies and scripts
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md          # This file
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual port number.

### Installation Issues

If you encounter errors during `npm install`:

1. Delete `node_modules` folder and `package-lock.json`
2. Clear npm cache: `npm cache clean --force`
3. Run `npm install` again

### Permission Errors (macOS/Linux)

If you get permission errors, try using `sudo` (not recommended) or fix npm permissions:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

See the [LICENSE](LICENSE) file for details.
