import './style.css';

export const Splash = () =>
  <div className='splash'>
    <h1>WeWish</h1>
    <footer>{process.env.REACT_APP_VERSION}</footer>
  </div>
