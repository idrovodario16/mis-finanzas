import React from 'react';
import {createRoot} from 'react-dom/client';
import Dashboard from './dashboard';
import {resetDemo} from './store';
import './styles.css';
createRoot(document.getElementById('root')!).render(<><div className="demo-banner" role="note"><strong>DEMO PÚBLICA</strong><span>Datos ficticios. Los cambios se guardan en este navegador; no hay cuenta ni conexión bancaria.</span><a href="https://github.com/idrovodario16/mis-finanzas">Ver código</a><button onClick={()=>{if(confirm('¿Restablecer los datos ficticios de esta demo?')){resetDemo();location.reload()}}}>Restablecer demo</button></div><Dashboard/></>);
