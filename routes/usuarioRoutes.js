import express from 'express';
import { formularioLogin, formularioRegistro, registrar, confirmar, formularioOlvidepassword, resetPassword } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/confirmar/:token', confirmar); // <-- Aquí está la ruta para confirmar, debe ser GET
router.get('/olvidepassword', formularioOlvidepassword);
router.post('/olvidepassword', resetPassword);

export default router;
