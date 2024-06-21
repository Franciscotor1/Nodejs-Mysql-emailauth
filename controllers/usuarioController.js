import { check, validationResult, body } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

export const formularioLogin = (req, res) => {
    res.render('auth/login', { pagina: 'Iniciar sesión' });
};

export const formularioRegistro = (req, res) => {
    res.render('auth/registro', { 
        pagina: 'Registrarse',
        csrfToken: req.csrfToken() 
    });
};

export const registrar = async (req, res) => {
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('Eso no parece un E-mail').run(req);
    await check('password').isLength({ min: 6 }).withMessage('6 caracteres para el password').run(req);
    await body('repeat_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los passwords no son iguales');
        }
        return true;
    }).run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Registrarse',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    const { nombre, email, password } = req.body;
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya está registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    });

    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    res.render('auth/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmación. Por favor, presiona en el enlace provisto.'
    }); 
};

export const confirmar = async (req, res) => {
    const { token } = req.params;
    console.log(`Token recibido: ${token}`);

    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario) {
        return res.render('auth/confirmarcuenta', {
            pagina: 'ERROR AL CONFIRMAR TU CUENTA',
            mensaje: 'Hubo un error al confirmar tu cuenta',
            error: true
        });
    }

    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmarcuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'Tu cuenta se ha confirmado exitosamente',
        error: false
    });
};

export const formularioOlvidepassword = (req, res) => {
    res.render('auth/olvidepassword', { pagina: 'Recuperar Password' });
};

export const resetPassword = (req, res) => {}
