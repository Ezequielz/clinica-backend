
import path from 'path';
import prisma from '../../../lib/prisma';
import PDFDocument from "pdfkit-table";
import { envs } from '../../../config/envs';
import { CustomError } from "../../helpers/custom.error";
import type { PaypalOrderStatusResponse } from './paypal.interface';


const paypalPayment = async (orderId: string) => {
    if (!orderId) {
        throw CustomError.badRequest('Missing orderId');
    };
    try {
        const orderExist = await prisma.order.findFirst({
            where: {
                OR: [{ id: orderId }, { id: { endsWith: orderId } }],
            },
            select: {
                id: true,
                transactionId: true,
                monto_total: true,
            },
        });

        if (!orderExist) {
            throw CustomError.badRequest(`No existe la orden con id: ${orderId}`);
        };
        if (!orderExist.transactionId) {
            throw CustomError.badRequest(`No hay transacciones efectuadas de esta orden: ${orderId}`);
        };
        const authToken = await getPaypalBearerToken();
        if (!authToken) {
            throw CustomError.internalServer('No se pudo obtener token de verificación');
        };

        const resp = await verifyPaypalPayment(orderExist.transactionId, authToken);
        if (!resp) {
            throw CustomError.internalServer('Error al verificar el pago');
        };

        return ({
            ok: true,
            resp,
            orderExist,
        });

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error al obtener orden',
        };
    }
};

const paypalcheckPayment = async (paypalTransactionId: string) => {
    if (!paypalTransactionId) {
        throw CustomError.badRequest('Missing paypalTransactionId');
    };

    const authToken = await getPaypalBearerToken();
    if (!authToken) {
        throw CustomError.internalServer('No se pudo obtener token de verificación');
    };

    const resp = await verifyPaypalPayment(paypalTransactionId, authToken);
    console.log({ resp })
    if (!resp) {
        throw CustomError.internalServer('Error al verificar el pago');
    };
    const { status, purchase_units } = resp;

    const { invoice_id: orderId } = purchase_units[0];

    if (status !== "COMPLETED") {
        return {
            ok: false,
            message: "El pago no se completó en PayPal",
        };
    };

    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { pagado: true, pagadoAt: new Date() },
        });

        return {
            ok: true,
            order,
            message: 'Orden actualizada, pagado marcado en true',
        };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'El pago no se realizó',
        };
    }
};



const generatePDF = async (id: string) => {
    try {
        const order = await prisma.order.findFirst({
            where: { id },
            include: {
                paciente: { include: { user: true } },
                consultas: {
                    include: {
                        servicio: true,
                        paquete: {
                            select: {
                                precio_paquete: true,
                                servicios_incluidos: {
                                    include: {
                                        servicio: true
                                    }
                                }
                            }
                        },
                        medico: { include: { user: true } },
                        turnosReservados: { include: { turno: true, medico: { include: { user: true } } } },
                        paciente: {
                            select: { obra_social: true }
                        }
                    },
                },
            },
        });

        if (!order) {
            return { ok: false, message: 'No se encontró una orden con ese id' }
        }

        if (!order.pagado) {
            return { ok: false, message: 'La orden no está pagada' }
        }
        const precioPaquete = order.consultas.at(0)?.paquete?.precio_paquete ?? 0
        const tieneObraSocial = !!order.paciente.obra_social;
        const subtotal = order.consultas.reduce((total, consulta) => total + consulta.servicio!.precio, 0);
        const descuentoPaquete = order.consultas.at(0)?.paquete ? subtotal - precioPaquete : null
        const descuentoObraSocial = tieneObraSocial ? (descuentoPaquete ? precioPaquete * 0.20 : subtotal * 0.20) : 0; 
  

  
        const doc = new PDFDocument({ margin: 40 });

     
        doc.rect(20, 20, 570, 750).stroke();

        const logoPath = path.join(__dirname, "../../../../public/logo.png");
        doc.image(logoPath, 330, -30, { width: 300, align: 'center' });
        doc.fontSize(30).text("TodoClínica S.A.", 40, 80, { align: "left" });

        // doc.moveTo(40, 115).lineTo(570, 115).stroke();
        // **Encabezado**
        doc.fontSize(10).text("CUIL: 30-12345678-9", 45);
        doc.text("Teléfono: +54 11 5555-5555", 45);
        doc.text("Dirección: Av. Siempre Viva 742, Buenos Aires", 45);
        doc.text("Email: contacto@todoclinica.com", 45).moveDown(3);



        // Datos de la orden y paciente
        doc.fontSize(12).text(`Factura N°: ${id}`);
        doc.fontSize(10).text(`Fecha de facturación: ${new Date().toLocaleDateString()}`).moveDown();
        doc.fontSize(12).text(`Paciente: ${order.paciente.user.nombre} ${order.paciente.user.apellido}`);
        doc.fontSize(10).text(`Email: ${order.paciente.user.email}`);
        doc.fontSize(10).text(`telefono: ${order.paciente.user.telefono}`);
        doc.moveDown(2);


        // Tabla de servicios
        const serviciosData = order.consultas.map((consulta, index) => {
            const fechaLegible = new Date(consulta.fecha_consulta).toLocaleDateString("es-ES", {
                weekday: "long", 
                day: "2-digit", 
                month: "long", 
                year: "numeric" 
            });

            return [
                index + 1,
                consulta.servicio ? consulta.servicio.nombre : "N/A",
                `${consulta.medico.user.nombre} ${consulta.medico.user.apellido}`,
                fechaLegible, 
                `${consulta.hora_consulta} hs`,
                "",
                `$${consulta?.servicio?.precio.toFixed(2)}`
            ];
        });


        serviciosData.push(
            [
                "",
                "",
                "",
                "",
                "",
                "Subtotal",
                `$${subtotal.toFixed(2)}`
            ]
        )
        if (descuentoPaquete) {
            serviciosData.push([
                "",
                "",
                "",
                "",
                "",
                "Descuento paquete",
                `-$${descuentoPaquete.toFixed(2)}`
            ],[
                "",
                "",
                "",
                "",
                "",
                "Total paquete",
                `$${precioPaquete.toFixed(2)}` 
            ]);
        }
        if (tieneObraSocial) {
            serviciosData.push([
                "",
                "",
                "",
                "",
                "",
                "Descuento por Obra Social",
                `-$${descuentoObraSocial.toFixed(2)}` 
            ]);
        }
    



        const table = {
            headers: [" # ", " Servicio ", " Médico ", " Día ", " Hora ", " Detalles ", " Precio "],
            rows: serviciosData.map(row => row.map(String)),
            widths: [25, 180, 180, 120, 70, 80, 80]
        };

        await doc.table(table, { width: 500, columnSpacing: 2 });

        // Total final
        doc.moveDown();
        doc.fontSize(14).text(`Total Pagado: $${order.monto_total.toFixed(2)}`, 380);

        // Footer
        doc.moveDown(2);
        doc.text('', 0)
        doc.fontSize(10).text("Gracias por confiar en TodoClínica. ¡Le esperamos nuevamente!", { align: 'center' });

        doc.end();

        return {
            ok: true,
            pdf: doc
        }

    } catch (error) {
        console.error("Error generando el PDF:", error);
        throw error; // Para que el controller maneje el error
    }
};


const getPaypalBearerToken = async () => {
    const PAYPAL_CLIENT_ID = envs.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = envs.PAYPAL_CLIENT_SECRET;
    const oauth2Url = envs.PAYPAL_OAUTH_URL ?? '';

    const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

    try {
        const response = await fetch(oauth2Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${base64Token}`,
            },
            body: 'grant_type=client_credentials',
        });
        const result = await response.json();

        return result.access_token || null;
    } catch (error) {
        console.error("Error obteniendo el token de PayPal:", error);
        return null;
    }
};

const verifyPaypalPayment = async (paypalTransactionId: string, bearerToken: string): Promise<PaypalOrderStatusResponse | null> => {
    const paypalOrderUrl = `${envs.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

    try {
        const response = await fetch(paypalOrderUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${bearerToken}` },
        });
        return await response.json();
    } catch (error) {
        console.error('Error verificando pago de PayPal:', error);
        return null;
    }
};




export const paymentsService = {
    // Methods  
    paypalPayment,
    paypalcheckPayment,
    generatePDF,
};