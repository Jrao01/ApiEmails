import 'dotenv/config';
import nodemailer from 'nodemailer';

// Creamos un único transportador para Resend usando variables de entorno
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.resend.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
    }
});

// Mantenemos el objeto rotatingTransporter para no romper el controlador (pero con lógica simplificada)
const rotatingTransporter = {
    getStats: () => {
        return {
            currentDate: new Date().toDateString(),
            dailyLimit: 'N/A',
            accounts: [{
                account: 1,
                email: process.env.EMAIL_FROM,
                dailyCount: 'N/A',
                remaining: 'N/A',
                isBlocked: false,
                lastError: null
            }]
        };
    }
};

// Función principal que mantiene la interfaz original
const nodemailerService = async (mensaje) => {
    try {
        // Aseguramos que el mensaje tenga un remitente si no se especifica
        const finalMailOptions = {
            from: process.env.EMAIL_FROM,
            ...mensaje
        };

        console.log(`📤 Enviando correo a: ${finalMailOptions.to}...`);
        const info = await transporter.sendMail(finalMailOptions);
        console.log(`✅ Correo enviado. MessageId: ${info.messageId}`);

        return info;
    } catch (error) {
        console.error('❌ Error al enviar correo:', error.message);
        throw error;
    }
};

export default nodemailerService;
export {
    rotatingTransporter
};