import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src='/assets/logo.svg' className="App-logo" alt="logo" />
        <p>
          Welcome <strong>User</strong>
        </p>
        <a
          className="App-link"
          href="/home"
        >
          Next
        </a>
      </header>
      <footer>
        <h6>©Copyright Lynch 2023</h6>
      </footer>
    </div>
  );
}

export default App;
